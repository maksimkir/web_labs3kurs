import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

// Перевірка правил Feature-Sliced Design: напрямок імпортів між шарами,
// заборона імпортів між слайсами одного шару та "глибоких" імпортів повз index.ts.
export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Структуру слайсів задано завданням (widgets/users-table, features/lottery тощо).
    // У невеликому застосунку кожен з них використовується в одному місці, тож
    // рекомендацію "об'єднати слайс з єдиним споживачем" вимикаємо.
    rules: { 'fsd/insignificant-slice': 'off' },
  },
  {
    // Сегмент app/providers (router, services, ui, store) теж задано завданням.
    files: ['./src/app/**'],
    rules: { 'fsd/segments-by-purpose': 'off' },
  },
])
