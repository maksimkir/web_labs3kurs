import { configureAuth } from '../api/httpClient'
import { authRepository } from '../repositories/authRepository'
import type { AuthTokens, LoginCredentials, User } from '../types/auth'

/**
 * Сесія — звичайний модуль поза React. Її читають і AuthContext (через
 * useSyncExternalStore), і route loader-и Data Mode, які не можуть викликати hooks.
 */

export interface Session {
  user: User
  tokens: AuthTokens
}

const STORAGE_KEY = 'study-planner:auth'

let current: Session | null = null
let restorePromise: Promise<Session | null> | null = null
let refreshPromise: Promise<string | null> | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

/**
 * Токени зберігаються в localStorage, щоб відновити сесію після F5 (додаткове завдання).
 * Ризик: localStorage доступний будь-якому JS на сторінці (XSS). Для навчального проєкту
 * це прийнятно; у реальному застосунку краще httpOnly cookie.
 */
function saveTokens(tokens: AuthTokens | null) {
  try {
    if (tokens) localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // сховище недоступне — сесія живе лише до перезавантаження
  }
}

function loadTokens(): AuthTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (
      typeof data === 'object' &&
      data !== null &&
      typeof (data as AuthTokens).accessToken === 'string' &&
      typeof (data as AuthTokens).refreshToken === 'string'
    ) {
      return data as AuthTokens
    }
  } catch {
    // пошкоджені дані — вважаємо, що сесії немає
  }
  return null
}

/** Токени без користувача: потрібні лише під час login/restore, до виклику /auth/me. */
let pendingTokens: AuthTokens | null = null

function setSession(next: Session | null) {
  current = next
  pendingTokens = null
  saveTokens(next?.tokens ?? null)
  emit()
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = current?.tokens.refreshToken ?? pendingTokens?.refreshToken
  if (!refreshToken) return null
  // кілька одночасних 401 → лише один запит на оновлення
  refreshPromise ??= authRepository
    .refresh(refreshToken)
    .then((tokens) => {
      if (current) setSession({ ...current, tokens })
      else pendingTokens = tokens
      return tokens.accessToken
    })
    .catch(() => {
      setSession(null)
      return null
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

configureAuth({
  getAccessToken: () => current?.tokens.accessToken ?? pendingTokens?.accessToken ?? null,
  refreshAccessToken,
})

export const session = {
  get: (): Session | null => current,
  getUser: (): User | null => current?.user ?? null,

  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  async login(credentials: LoginCredentials): Promise<User> {
    pendingTokens = await authRepository.login(credentials)
    try {
      const user = await authRepository.me()
      setSession({ user, tokens: pendingTokens })
      return user
    } catch (error) {
      pendingTokens = null
      throw error
    }
  },

  logout(): void {
    setSession(null)
  },

  /**
   * Відновлення сесії після перезавантаження: збережений token → GET /auth/me.
   * Викликається один раз у root loader; повторні виклики повертають той самий результат.
   */
  restore(): Promise<Session | null> {
    restorePromise ??= (async () => {
      const tokens = loadTokens()
      if (!tokens) return null
      pendingTokens = tokens
      try {
        const user = await authRepository.me()
        setSession({ user, tokens: pendingTokens })
      } catch {
        // токени недійсні (і refresh не допоміг) — гість
        setSession(null)
      }
      return current
    })()
    return restorePromise
  },
}
