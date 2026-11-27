/**
 * Централізована нормалізація помилок: будь-яка помилка (мережа, HTTP-статус,
 * зламаний JSON, скасування) перетворюється на ApiError з однаковою формою.
 */
export type ApiErrorKind = 'http' | 'network' | 'parse' | 'config' | 'abort' | 'unknown'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  /** HTTP-статус, якщо сервер відповів (лише для kind === 'http'). */
  readonly status: number | null

  constructor(kind: ApiErrorKind, message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  // fetch кидає DOMException з name === 'AbortError' після controller.abort()
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new ApiError('abort', 'Запит скасовано')
  }
  // fetch кидає TypeError, коли сервер недоступний (немає мережі, CORS, DNS)
  if (error instanceof TypeError) {
    return new ApiError('network', error.message)
  }
  if (error instanceof Error) return new ApiError('unknown', error.message)
  return new ApiError('unknown', String(error))
}

/** Скасований запит — не помилка для користувача, його просто ігноруємо. */
export function isAbortError(error: unknown): boolean {
  return normalizeError(error).kind === 'abort'
}

/** Зрозуміле користувачу повідомлення замість технічного тексту помилки. */
export function getErrorMessage(error: unknown): string {
  const apiError = normalizeError(error)
  switch (apiError.kind) {
    case 'network':
      return 'Не вдалося з’єднатися із сервером. Перевірте підключення до інтернету.'
    case 'config':
      return 'Не налаштовано адресу API (VITE_API_URL).'
    case 'parse':
      return 'Сервер повернув некоректні дані.'
    case 'abort':
      return 'Запит скасовано.'
    case 'http':
      if (apiError.status === 404) return 'Завдання не знайдено на сервері.'
      if (apiError.status !== null && apiError.status >= 500) {
        return 'Сервер тимчасово недоступний. Спробуйте пізніше.'
      }
      return `Помилка запиту (${apiError.status}): ${apiError.message}`
    default:
      return 'Сталася неочікувана помилка.'
  }
}
