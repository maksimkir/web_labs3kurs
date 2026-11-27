import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Pinia + плагін збереження стану в localStorage (опція persist у сторі).
export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
