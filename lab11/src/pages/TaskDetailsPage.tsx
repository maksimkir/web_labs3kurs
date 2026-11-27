import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '../api/errors'
import StatusMessage from '../components/StatusMessage'
import TaskFormDialog from '../components/TaskFormDialog'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useTaskDetails } from '../hooks/useTaskDetails'
import { useToast } from '../hooks/useToast'
import type { TaskFormData } from '../schemas/taskSchema'
import { PRIORITY_LABELS } from '../types/task'
import NotFoundPage from './NotFoundPage'
import './TaskDetailsPage.scss'

const dateFormatter = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'long', timeStyle: 'short' })

function TaskDetailsPage() {
  // route param з URL /tasks/:taskId
  const { taskId } = useParams()
  const id = Number(taskId)

  if (!Number.isInteger(id) || id <= 0) return <NotFoundPage />
  // key: для іншого id — новий екземпляр зі своїм станом запиту
  return <TaskDetails key={id} id={id} />
}

function TaskDetails({ id }: { id: number }) {
  const { status, task, error, reload, update, remove } = useTaskDetails(id)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const requireAuth = useRequireAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    document.title = task ? `${task.title} — Study Planner` : 'Завдання — Study Planner'
  }, [task])

  const closeEdit = useCallback(() => setIsEditOpen(false), [])

  const handleEdit = useCallback(
    async (data: TaskFormData) => {
      await update(data)
      setIsEditOpen(false)
      toast.success('Зміни збережено')
    },
    [update, toast],
  )

  async function handleToggle() {
    if (!task || !requireAuth()) return
    try {
      await update({ completed: !task.completed })
    } catch (toggleError) {
      toast.error(`Не вдалося змінити статус: ${getErrorMessage(toggleError)}`)
    }
  }

  async function handleDelete() {
    if (!requireAuth()) return
    setIsDeleting(true)
    try {
      await remove()
      toast.success('Завдання видалено')
      navigate('/tasks')
    } catch (deleteError) {
      toast.error(`Не вдалося видалити: ${getErrorMessage(deleteError)}`)
      setIsDeleting(false)
      setIsConfirmingDelete(false)
    }
  }

  return (
    <article className="task-details-page">
      <Link to="/tasks" className="task-details-page__back">
        ← До списку
      </Link>

      {status === 'loading' && <StatusMessage variant="loading">Loading...</StatusMessage>}
      {status === 'error' && (
        <StatusMessage variant="error" onRetry={reload}>
          {error}
        </StatusMessage>
      )}

      {status === 'success' && task && (
        <section className="task-details-page__card">
          <header className="task-details-page__header">
            <h1 className="task-details-page__title">{task.title}</h1>
            <span className="task-details-page__id">#{task.id}</span>
          </header>

          <dl className="task-details-page__list">
            <dt className="task-details-page__term">Опис</dt>
            <dd className="task-details-page__value">
              {task.description || <span className="task-details-page__muted">Без опису</span>}
            </dd>
            <dt className="task-details-page__term">Категорія</dt>
            <dd className="task-details-page__value">{task.category}</dd>
            <dt className="task-details-page__term">Пріоритет</dt>
            <dd className="task-details-page__value">{PRIORITY_LABELS[task.priority]}</dd>
            <dt className="task-details-page__term">Статус</dt>
            <dd
              className={`task-details-page__value task-details-page__value--${task.completed ? 'completed' : 'active'}`}
            >
              {task.completed ? 'Виконано' : 'Не виконано'}
            </dd>
            <dt className="task-details-page__term">Створив</dt>
            <dd className="task-details-page__value">{task.createdBy}</dd>
            <dt className="task-details-page__term">Створено</dt>
            <dd className="task-details-page__value">
              {task.createdAt ? (
                dateFormatter.format(new Date(task.createdAt))
              ) : (
                <span className="task-details-page__muted">Невідомо — API не надає дату</span>
              )}
            </dd>
          </dl>

          {isConfirmingDelete ? (
            <div className="task-details-page__confirm" role="alertdialog" aria-label="Підтвердження видалення">
              <p className="task-details-page__confirm-text">Видалити це завдання? Дію не можна скасувати.</p>
              <button type="button" className="button button--danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Видалення…' : 'Так, видалити'}
              </button>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
              >
                Ні
              </button>
            </div>
          ) : (
            <div className="task-details-page__actions">
              <button type="button" className="button button--primary" onClick={() => requireAuth() && setIsEditOpen(true)}>
                Редагувати
              </button>
              <button type="button" className="button" onClick={handleToggle}>
                {task.completed ? 'Повернути в роботу' : 'Позначити виконаним'}
              </button>
              <button
                type="button"
                className="button button--danger"
                onClick={() => requireAuth() && setIsConfirmingDelete(true)}
              >
                Видалити
              </button>
            </div>
          )}

          <TaskFormDialog open={isEditOpen} mode="edit" task={task} onClose={closeEdit} onSubmit={handleEdit} />
        </section>
      )}
    </article>
  )
}

export default TaskDetailsPage
