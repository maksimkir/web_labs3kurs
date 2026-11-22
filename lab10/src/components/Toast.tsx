import { useEffect } from 'react'
import type { ToastMessage } from '../types/toast'
import './Toast.scss'

const TOAST_DURATION_MS = 3000

const ICONS = { success: '✓', error: '!', info: 'i' } as const

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: number) => void
}

function Toast({ toast, onDismiss }: ToastProps) {
  // автозакриття — побічний ефект: таймер запускається при появі й очищується при зникненні
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div className={`toast toast--${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <span className="toast__icon" aria-hidden="true">
        {ICONS[toast.type]}
      </span>
      <p className="toast__text">{toast.text}</p>
      <button
        type="button"
        className="toast__close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Закрити повідомлення"
      >
        ×
      </button>
    </div>
  )
}

export default Toast
