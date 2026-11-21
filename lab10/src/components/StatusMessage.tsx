import type { ReactNode } from 'react'
import './StatusMessage.scss'

type StatusVariant = 'loading' | 'error' | 'empty' | 'success'

interface StatusMessageProps {
  variant: StatusVariant
  children: ReactNode
  /** Для помилки — кнопка повторного запиту. */
  onRetry?: () => void
  compact?: boolean
}

/** Окремий візуальний стан асинхронної операції: loading, error, empty або success. */
function StatusMessage({ variant, children, onRetry, compact = false }: StatusMessageProps) {
  return (
    <div
      className={`status-message status-message--${variant}${compact ? ' status-message--compact' : ''}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {variant === 'loading' && <span className="status-message__spinner" aria-hidden="true" />}
      <div className="status-message__text">{children}</div>
      {onRetry && (
        <button type="button" className="button button--small button--primary" onClick={onRetry}>
          Спробувати ще
        </button>
      )}
    </div>
  )
}

export default StatusMessage
