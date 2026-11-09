import type { Router } from 'vue-router'
import { setAuthHooks } from '@/api/http-client'
import type { useAuthStore } from '@/stores/auth'

// Зв'язує http-клієнт зі стором авторизації: клієнт бере звідти токен і просить
// його оновити, а сам про Pinia нічого не знає.
export function installAuthInterceptor(auth: ReturnType<typeof useAuthStore>, router: Router): void {
  setAuthHooks({
    getAccessToken: () => auth.accessToken,
    // при 401 http-клієнт отримує новий accessToken через POST /auth/refresh
    refreshAccessToken: () => auth.refresh(),
    onSessionExpired: () => {
      auth.logout()
      const current = router.currentRoute.value
      if (current.name !== 'login') {
        router.push({ name: 'login', query: { redirect: current.fullPath } })
      }
    },
  })
}
