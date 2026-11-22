/** URL сторінки входу з поверненням на поточний маршрут після успішного входу. */
export function loginPath(redirectTo?: string): string {
  return redirectTo && redirectTo !== '/login'
    ? `/login?redirectTo=${encodeURIComponent(redirectTo)}`
    : '/login'
}

/** Дозволяємо повертатися лише на внутрішні шляхи (захист від open redirect). */
export function safeRedirect(target: string | null, fallback = '/tasks'): string {
  if (!target || !target.startsWith('/') || target.startsWith('//')) return fallback
  return target
}
