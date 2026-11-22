import { useEffect } from 'react'
import { useTaskDetails } from '../hooks/useTaskDetails'
import { PRIORITY_LABELS } from '../types/task'
import StatusMessage from './StatusMessage'
import './TaskDetails.scss'

interface TaskDetailsProps {
  taskId: number
  onClose: () => void
}

/** Модальне вікно з актуальними даними завдання (GET за id через taskRepository.getById). */
function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  const { status, task, error, reload } = useTaskDetails(taskId)

  // закриття по Escape — підписка на подію документа з cleanup
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="task-details" onClick={onClose}>
      <section
        className="task-details__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="task-details__header">
          <h2 id="task-details-title" className="task-details__title">
            Завдання #{taskId}
          </h2>
          <button type="button" className="task-details__close" onClick={onClose} aria-label="Закрити деталі">
            ×
          </button>
        </header>

        {status === 'loading' && <StatusMessage variant="loading">Loading...</StatusMessage>}
        {status === 'error' && (
          <StatusMessage variant="error" onRetry={reload}>
            {error}
          </StatusMessage>
        )}
        {status === 'success' && task && (
          <dl className="task-details__list">
            <dt className="task-details__term">Назва</dt>
            <dd className="task-details__value">{task.title}</dd>
            <dt className="task-details__term">Опис</dt>
            <dd className="task-details__value">
              {task.description || <span className="task-details__muted">Без опису</span>}
            </dd>
            <dt className="task-details__term">Категорія</dt>
            <dd className="task-details__value">{task.category}</dd>
            <dt className="task-details__term">Пріоритет</dt>
            <dd className="task-details__value">{PRIORITY_LABELS[task.priority]}</dd>
            <dt className="task-details__term">Статус</dt>
            <dd
              className={`task-details__value task-details__value--${task.completed ? 'completed' : 'active'}`}
            >
              {task.completed ? 'Виконано' : 'Не виконано'}
            </dd>
          </dl>
        )}
      </section>
    </div>
  )
}

export default TaskDetails
