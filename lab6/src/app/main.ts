import { createApp } from 'vue'
import '@fontsource/open-sans/latin-400.css'
import '@fontsource/open-sans/latin-600.css'
import '@fontsource/open-sans/latin-700.css'
import '@fontsource/open-sans/cyrillic-400.css'
import '@fontsource/open-sans/cyrillic-600.css'
import '@fontsource/open-sans/cyrillic-700.css'
import './styles/main.scss'
import App from './App.vue'
import { installAuthInterceptor } from './providers/auth-interceptor'
import { router } from './providers/router'
import { registerServices } from './providers/services'
import { pinia } from './providers/store'
import { setupUi } from './providers/ui'
import { useSessionStore } from '@/entities/session'

registerServices()

const app = createApp(App)
app.use(pinia)
app.use(router)
setupUi(app)

const session = useSessionStore()
installAuthInterceptor(session, router)

// Перевіряємо збережений токен через GET /auth/me (з заголовком Authorization: Bearer).
// Прострочений токен оновиться interceptor-ом, недійсна сесія завершиться виходом.
if (session.isAuthenticated) {
  session.fetchMe().catch(() => undefined)
}

// Монтуємо після першої навігації, щоб одразу показати правильний layout.
router.isReady().then(() => app.mount('#app'))
