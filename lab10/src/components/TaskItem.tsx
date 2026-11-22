import { useState } from 'react'
import { PRIORITY_LABELS, type NewTask, type Task } from '../types/task'
import TaskForm from './TaskForm'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => Promise<void>
  onUpdate: (id: number, changes: NewTask) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onOpenDetails: (id: number) => void
}

/** Локальний UI-стан картки: перегляд, редагування або підтвердження видалення. */
type Mode = 'view' | 'editing' | 'confirmDelete'

function TaskItem({ task, onToggle, onUpdate, onDelete, onOpenDetails }: TaskItemProps) {
  const [mode, setMode] = useState<Mode>('view')
  const [isDeleting, setIsDeleting] = useState(false)

  if (mode === 'editing') {
    const { title, description, category, priority } = task
    return (
      <li className="task-item task-item--editing">
        <TaskForm
          initialValues={{ title, description, category, priority }}
          onSubmit={async (changes) => {
            await onUpdate(task.id, changes)
            setMode('view')
          }}
          onCancel={() => setMode('view')}
        />
      </li>
    )
  }

  async function handleConfirmDelete() {
    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      // при успіху картка зникне зі списку; при помилці — повертаємось до перегляду
      setIsDeleting(false)
      setMode('view')
    }
  }

  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}${mode === 'confirmDelete' ? ' task-item--confirm' : ''}`}>
      <div className="task-item__body">
        <h3 className="task-item__title">
          <button type="button" className="task-item__link" onClick={() => onOpenDetails(task.id)}>
            {task.title}
          </button>
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

        {mode === 'confirmDelete' && (
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
                onClick={() => setMode('view')}
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
          disabled={mode !== 'view'}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
        </button>
        <button type="button" className="button button--small" onClick={() => setMode('editing')} disabled={mode !== 'view'}>
          Редагувати
        </button>
        <button
          type="button"
          className="button button--small button--danger"
          onClick={() => setMode('confirmDelete')}
          aria-label={`Видалити завдання «${task.title}»`}
          disabled={mode !== 'view'}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default TaskItem
