import { useCallback, useMemo, useRef, useState } from 'react'
import type { ToastApi, ToastMessage, ToastType } from '../types/toast'

/** На екрані одночасно щонайбільше стільки повідомлень. */
const MAX_TOASTS = 3

/** Черга toast-повідомлень: показ і закриття. Таймер автозакриття живе в самому Toast. */
export function useToasts() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback((type: ToastType, text: string) => {
    nextId.current += 1
    const toast = { id: nextId.current, type, text }
    setToasts((prev) => [...prev, toast].slice(-MAX_TOASTS))
  }, [])

  const toast = useMemo<ToastApi>(
    () => ({
      success: (text) => show('success', text),
      error: (text) => show('error', text),
      info: (text) => show('info', text),
    }),
    [show],
  )

  return { toasts, toast, dismiss }
}
