import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ServiceProvider } from '@/shared/api'
import { AUTH_SERVICE_KEY, type AuthRepository } from '../api/auth.service'
import type { AuthTokens, AuthUser, LoginCredentials } from './types'

const STORAGE_KEY = 'session'

const authService = () => ServiceProvider.get<AuthRepository>(AUTH_SERVICE_KEY)

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:user`)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

function writeItem(key: string, value: string | null): void {
  if (value === null) localStorage.removeItem(`${STORAGE_KEY}:${key}`)
  else localStorage.setItem(`${STORAGE_KEY}:${key}`, value)
}

function toAuthUser({ id, username, email, firstName, lastName, gender, image }: AuthUser): AuthUser {
  return { id, username, email, firstName, lastName, gender, image }
}

// Setup store сесії. Токени й поточний користувач синхронізуються з localStorage
// вручну (для порівняння: стори theme і lottery зберігаються плагіном
// pinia-plugin-persistedstate, див. README).
export const useSessionStore = defineStore('session', () => {
  // ---- state ----
  const accessToken = ref<string | null>(localStorage.getItem(`${STORAGE_KEY}:accessToken`))
  const refreshToken = ref<string | null>(localStorage.getItem(`${STORAGE_KEY}:refreshToken`))
  const user = ref<AuthUser | null>(readUser())

  // ---- getters ----
  const isAuthenticated = computed(() => accessToken.value !== null)

  // ---- actions ----
  function setSession(tokens: AuthTokens, profile?: AuthUser): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    writeItem('accessToken', tokens.accessToken)
    writeItem('refreshToken', tokens.refreshToken)
    if (profile) setUser(profile)
  }

  function setUser(profile: AuthUser): void {
    user.value = toAuthUser(profile)
    writeItem('user', JSON.stringify(user.value))
  }

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    writeItem('accessToken', null)
    writeItem('refreshToken', null)
    writeItem('user', null)
  }

  /** POST /auth/login: токени й дані користувача потрапляють у стор. */
  async function login(credentials: LoginCredentials): Promise<void> {
    const { accessToken: access, refreshToken: refresh, ...profile } =
      await authService().login(credentials)
    setSession({ accessToken: access, refreshToken: refresh }, profile)
  }

  /** GET /auth/me (з Authorization: Bearer): перевіряє токен і оновлює дані користувача. */
  async function fetchMe(): Promise<void> {
    if (!isAuthenticated.value) return
    const me = await authService().me()
    if (isAuthenticated.value) setUser(me)
  }

  /** POST /auth/refresh. Повертає новий accessToken або null, якщо refreshToken теж недійсний. */
  async function refresh(): Promise<string | null> {
    if (!refreshToken.value) return null
    try {
      const tokens = await authService().refresh(refreshToken.value)
      if (!isAuthenticated.value) return null
      setSession(tokens)
      return tokens.accessToken
    } catch {
      return null
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setSession,
    clearSession,
    login,
    fetchMe,
    refresh,
  }
})
