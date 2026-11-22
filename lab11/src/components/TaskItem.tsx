import { useState } from 'react'
import { Link } from 'react-router'
import { PRIORITY_LABELS, type Task } from '../types/task'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => Promise<void>
  /** Повертає false, якщо дію заборонено (гість) — тоді підтвердження не показується. */
  onRequestDelete: () => boolean
  onDelete: (id: number) => Promise<void>
}

function TaskItem({ task, onToggle, onRequestDelete, onDelete }: TaskItemProps) {
  // локальний UI-стан картки: підтвердження видалення
  const [isConfirming, setIsConfirming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirmDelete() {
    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
      setIsConfirming(false)
    }
  }

  return (
    <li
      className={`task-item${task.completed ? ' task-item--completed' : ''}${isConfirming ? ' task-item--confirm' : ''}`}
    >
      <div className="task-item__body">
        <h3 className="task-item__title">
          {/* route param: /tasks/:taskId */}
          <Link className="task-item__link" to={`/tasks/${task.id}`}>
            {task.title}
          </Link>
        </h3>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta">
          <span className="task-item__category">{task.category}</span>
          <span className={`task-item__priority task-item__priority--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="task-item__status">{task.completed ? 'Виконано' : 'Не виконано'}</span>
          <span className="task-item__id">#{task.id}</span>
        </div>

        {isConfirming && (
          <div className="task-item__confirm" role="alertdialog" aria-label="Підтвердження видалення">
            <p className="task-item__confirm-text">Видалити це завдання? Дію не можна скасувати.</p>
            <div className="task-item__confirm-actions">
              <button
                type="button"
                className="button button--small button--danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Видалення…' : 'Так, видалити'}
              </button>
              <button
                type="button"
                className="button button--small button--ghost"
                onClick={() => setIsConfirming(false)}
                disabled={isDeleting}
              >
                Ні
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className={`button button--small${task.completed ? '' : ' button--primary'}`}
          onClick={() => onToggle(task)}
          aria-pressed={task.completed}
          disabled={isConfirming}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
        </button>
        <Link className="button button--small" to={`/tasks/${task.id}`}>
          Деталі
        </Link>
        <button
          type="button"
          className="button button--small button--danger"
          onClick={() => {
            if (onRequestDelete()) setIsConfirming(true)
          }}
          aria-label={`Видалити завдання «${task.title}»`}
          disabled={isConfirming}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default TaskItem
