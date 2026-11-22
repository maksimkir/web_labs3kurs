import { createContext } from 'react'
import type { ToastApi, ToastMessage } from '../types/toast'

export interface ToastContextValue {
  toast: ToastApi
  toasts: ToastMessage[]
  dismissToast: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
