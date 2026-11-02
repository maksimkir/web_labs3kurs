/** Приймаємо лише внутрішні шляхи, щоб ?redirect= не вів на сторонній сайт. */
export function safeRedirect(value: unknown): string | null {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null
}
