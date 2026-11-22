import { useMemo, type ReactNode } from 'react'
import { useToasts } from '../hooks/useToasts'
import { ToastContext } from './toast-context'

/** Сповіщення потрібні багатьом компонентам, тому з №9 лишаються в Context (це client/UI state). */
export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, toast, dismiss } = useToasts()
  const value = useMemo(() => ({ toasts, toast, dismissToast: dismiss }), [toasts, toast, dismiss])
  return <ToastContext value={value}>{children}</ToastContext>
}
