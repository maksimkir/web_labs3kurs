import { API_URL as BASE_URL } from '@/shared/config'

// Єдине місце, де відомо про fetch, базову адресу, заголовки та обробку помилок.
// Репозиторії передають лише шлях (/users/1), без хардкоду URL.

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export interface HttpOptions extends RequestInit {
  /** Додати заголовок Authorization: Bearer <accessToken>. */
  auth?: boolean
}

/** Звідки клієнт бере токен і як його оновлює (підключається в plugins/auth-interceptor.ts). */
export interface AuthHooks {
  getAccessToken(): string | null
  /** Повертає новий accessToken або null, якщо оновити не вдалося. */
  refreshAccessToken(): Promise<string | null>
  onSessionExpired(): void
}

let authHooks: AuthHooks | null = null

export function setAuthHooks(hooks: AuthHooks | null): void {
  authHooks = hooks
}

// Кілька паралельних запитів з 401 чекають на одне й те саме оновлення токена.
let pendingRefresh: Promise<string | null> | null = null

function refreshOnce(hooks: AuthHooks): Promise<string | null> {
  pendingRefresh ??= hooks.refreshAccessToken().finally(() => {
    pendingRefresh = null
  })
  return pendingRefresh
}

function send(path: string, init: RequestInit, token: string | null): Promise<Response> {
  if (!BASE_URL) {
    throw new Error('VITE_API_URL не задано: скопіюйте .env.example у .env')
  }

  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(`${BASE_URL}${path}`, { ...init, headers })
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json()
    if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
      return body.message
    }
  } catch {
    // тіло відповіді не JSON
  }
  return `HTTP ${response.status}: ${response.statusText}`
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { auth = false, ...init } = options
  const token = auth ? (authHooks?.getAccessToken() ?? null) : null

  let response = await send(path, init, token)

  // Interceptor: при 401 оновлюємо accessToken через refreshToken і повторюємо запит один раз.
  if (response.status === 401 && token && authHooks) {
    const freshToken = await refreshOnce(authHooks)
    if (freshToken) {
      response = await send(path, init, freshToken)
    }
    if (!freshToken || response.status === 401) {
      authHooks.onSessionExpired()
    }
  }

  if (!response.ok) {
    throw new HttpError(response.status, await errorMessage(response))
  }

  return (await response.json()) as T
}

/** Збирає query-рядок, пропускаючи порожні значення. */
export function toQueryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const query = search.toString()
  return query ? `?${query}` : ''
}
