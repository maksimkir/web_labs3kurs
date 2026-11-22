import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginCredentials } from '@/types/auth'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'vue-lottery:auth'

interface Session {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

function toAuthUser({ id, username, email, firstName, lastName, gender, image }: AuthUser): AuthUser {
  return { id, username, email, firstName, lastName, gender, image }
}

// accessToken, refreshToken і дані користувача зберігаються в сторі та дублюються
// в localStorage, щоб сесія переживала перезавантаження сторінки.
export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(loadFromStorage<Session | null>(STORAGE_KEY, null))

  const user = computed(() => session.value?.user ?? null)
  const accessToken = computed(() => session.value?.accessToken ?? null)
  const isAuthenticated = computed(() => session.value !== null)

  watch(session, (value) => saveToStorage(STORAGE_KEY, value), { deep: true })

  async function login(credentials: LoginCredentials): Promise<void> {
    const { accessToken, refreshToken, ...profile } = await ServiceProvider.auth.login(credentials)
    session.value = { user: toAuthUser(profile), accessToken, refreshToken }
  }

  /** GET /auth/me: перевіряє збережений токен і оновлює дані користувача. */
  async function fetchMe(): Promise<void> {
    if (!session.value) return
    const me = await ServiceProvider.auth.me()
    if (session.value) session.value.user = toAuthUser(me)
  }

  /** Повертає новий accessToken або null, якщо refreshToken теж недійсний. */
  async function refresh(): Promise<string | null> {
    const refreshToken = session.value?.refreshToken
    if (!refreshToken) return null
    try {
      const tokens = await ServiceProvider.auth.refresh(refreshToken)
      if (!session.value) return null
      session.value.accessToken = tokens.accessToken
      session.value.refreshToken = tokens.refreshToken
      return tokens.accessToken
    } catch {
      return null
    }
  }

  function logout(): void {
    session.value = null
  }

  return { session, user, accessToken, isAuthenticated, login, fetchMe, refresh, logout }
})
