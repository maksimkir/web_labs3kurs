import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type Theme = 'light' | 'dark'

const DARK_CLASS = 'app-dark'

function systemTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Налаштування теми. Збереження в localStorage робить плагін
// pinia-plugin-persistedstate (persist: true) — без ручного коду.
export const useThemeStore = defineStore(
  'theme',
  () => {
    const theme = ref<Theme>(systemTheme())
    const isDark = computed(() => theme.value === 'dark')

    function toggle(): void {
      theme.value = isDark.value ? 'light' : 'dark'
    }

    // клас на <html> вмикає темну тему PrimeVue (darkModeSelector) і стилів застосунку
    watch(
      theme,
      (value) => document.documentElement.classList.toggle(DARK_CLASS, value === 'dark'),
      { immediate: true, flush: 'sync' },
    )

    return { theme, isDark, toggle }
  },
  { persist: true },
)
