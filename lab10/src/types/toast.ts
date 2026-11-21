export type ToastType = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  type: ToastType
  text: string
}

/** API сповіщень, який компоненти отримують з контексту. */
export interface ToastApi {
  success: (text: string) => void
  error: (text: string) => void
  info: (text: string) => void
}
