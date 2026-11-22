import { ApiError, normalizeError } from './errors'

/**
 * HTTP client — єдине місце, яке знає про fetch, базовий URL і формат помилок.
 * Він нічого не знає про Task чи DummyJSON: лише будує URL, виконує запит,
 * перевіряє response.ok і повертає JSON або кидає ApiError.
 */

type QueryValue = string | number | boolean | undefined
export type QueryParams = Record<string, QueryValue>

export interface RequestOptions {
  query?: QueryParams
  body?: unknown
  /** AbortSignal для скасування запиту (AbortController.signal). */
  signal?: AbortSignal
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

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

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, signal } = options
  let response: Response
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    // мережа, скасування або помилка конфігурації — усе в одному форматі
    throw normalizeError(error)
  }

  if (!response.ok) {
    throw new ApiError('http', await readErrorMessage(response), response.status)
  }

  try {
    return (await response.json()) as T
  } catch (error) {
    // скасування під час читання тіла теж має лишитися скасуванням
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
