import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource/open-sans/latin-400.css'
import '@fontsource/open-sans/latin-600.css'
import '@fontsource/open-sans/latin-700.css'
import '@fontsource/open-sans/cyrillic-400.css'
import '@fontsource/open-sans/cyrillic-600.css'
import '@fontsource/open-sans/cyrillic-700.css'
import './assets/styles/main.scss'
import App from './App.vue'
import { installAuthInterceptor } from './plugins/auth-interceptor'
import { router } from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const auth = useAuthStore()
installAuthInterceptor(auth, router)

// Перевіряємо збережений токен через GET /auth/me (з заголовком Authorization: Bearer).
// Прострочений токен оновиться interceptor-ом, недійсна сесія завершиться виходом.
if (auth.isAuthenticated) {
  auth.fetchMe().catch(() => undefined)
}

// Монтуємо після першої навігації, щоб одразу показати правильний layout.
router.isReady().then(() => app.mount('#app'))
