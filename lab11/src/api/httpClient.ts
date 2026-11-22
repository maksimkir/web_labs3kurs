import { ApiError, normalizeError } from './errors'

/**
 * HTTP client — єдине місце, яке знає про fetch, базовий URL, формат помилок
 * і заголовок Authorization. Він нічого не знає про Task чи DummyJSON.
 */

type QueryValue = string | number | boolean | undefined
export type QueryParams = Record<string, QueryValue>

export interface RequestOptions {
  query?: QueryParams
  body?: unknown
  /** AbortSignal для скасування запиту (AbortController.signal). */
  signal?: AbortSignal
  /** true — запит потребує автентифікації: додається Authorization: Bearer <token>. */
  auth?: boolean
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Звідки брати token. httpClient не залежить від React і від модуля сесії:
 * сесія сама реєструє ці функції через configureAuth().
 */
export interface AuthHandlers {
  getAccessToken: () => string | null
  /** Оновлює токен (refresh token flow). Повертає новий accessToken або null. */
  refreshAccessToken: () => Promise<string | null>
}

let authHandlers: AuthHandlers | null = null

export function configureAuth(handlers: AuthHandlers): void {
  authHandlers = handlers
}

/** Чи є активний token (для захищених операцій, які не йдуть на сервер). */
export function hasAccessToken(): boolean {
  return Boolean(authHandlers?.getAccessToken())
}

function getBaseUrl(): string {
  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new ApiError('config', 'VITE_API_URL is not defined. Create .env from .env.example.')
  }
  return baseUrl.replace(/\/+$/, '')
}

export function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(`${getBaseUrl()}/${path.replace(/^\/+/, '')}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

/** Дістає текст помилки з тіла відповіді ({ message: '...' } у DummyJSON). */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json()
    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String((data as { message: unknown }).message)
    }
  } catch {
    // тіло порожнє або не JSON — повертаємо стандартний текст статусу
  }
  return response.statusText || 'Request failed'
}

function buildHeaders(body: unknown, token: string | null): HeadersInit {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  // Authorization формується лише тут — компоненти й repository його не дублюють
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

function requireToken(): string {
  const token = authHandlers?.getAccessToken() ?? null
  if (!token) throw new ApiError('unauthorized', 'Authentication required')
  return token
}

async function send(method: HttpMethod, path: string, options: RequestOptions, token: string | null) {
  const { query, body, signal } = options
  try {
    return await fetch(buildUrl(path, query), {
      method,
      signal,
      headers: buildHeaders(body, token),
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    // мережа, скасування або помилка конфігурації — усе в одному форматі
    throw normalizeError(error)
  }
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  // захищений запит без токена навіть не відправляється
  const token = options.auth ? requireToken() : null
  let response = await send(method, path, options, token)

  // accessToken прострочений → один раз оновлюємо його й повторюємо запит
  if (response.status === 401 && options.auth && authHandlers) {
    const freshToken = await authHandlers.refreshAccessToken()
    if (freshToken) response = await send(method, path, options, freshToken)
  }

  if (!response.ok) {
    throw new ApiError('http', await readErrorMessage(response), response.status)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    const normalized = normalizeError(error)
    if (normalized.kind === 'abort') throw normalized
    throw new ApiError('parse', 'Response is not valid JSON')
  }
}

export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'body'>) => request<T>('GET', path, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>('POST', path, { ...options, body }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>('PUT', path, { ...options, body }),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>('PATCH', path, { ...options, body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
