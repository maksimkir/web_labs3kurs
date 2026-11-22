import { definePreset, palette } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import type { App } from 'vue'
import 'primeicons/primeicons.css'

// Тема Aura з основним кольором застосунку (#00a3dc, як у попередніх лабах).
// У світлій темі кнопки трохи темніші, щоб білий текст на них був читабельним.
const LotteryPreset = definePreset(Aura, {
  semantic: {
    primary: palette('#00a3dc'),
    colorScheme: {
      light: {
        primary: {
          color: '{primary.600}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.700}',
          activeColor: '{primary.800}',
        },
      },
    },
  },
})

/** Підключення UI-бібліотеки: компоненти імпортуються окремо в shared/ui (tree-shaking). */
export function setupUi(app: App): void {
  app.use(PrimeVue, {
    theme: {
      preset: LotteryPreset,
      // темна тема вмикається класом на <html> (див. features/theme-toggle)
      options: { darkModeSelector: '.app-dark' },
    },
  })
  app.use(ToastService)
}
