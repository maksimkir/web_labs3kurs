import type { Router } from 'vue-router'
import { setAuthHooks } from '@/shared/api'
import type { useSessionStore } from '@/entities/session'

// Зв'язує http-клієнт зі стором авторизації: клієнт бере звідти токен і просить
// його оновити, а сам про Pinia нічого не знає.
export function installAuthInterceptor(
  session: ReturnType<typeof useSessionStore>,
  router: Router,
): void {
  setAuthHooks({
    getAccessToken: () => session.accessToken,
    // при 401 http-клієнт отримує новий accessToken через POST /auth/refresh
    refreshAccessToken: () => session.refresh(),
    onSessionExpired: () => {
      session.clearSession()
      const current = router.currentRoute.value
      if (current.name !== 'login') {
        router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    },
  })
}
