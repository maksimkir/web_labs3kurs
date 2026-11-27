import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useId, useRef, type SyntheticEvent } from 'react'
import { useForm } from 'react-hook-form'
import { getErrorMessage } from '../api/errors'
import { DESCRIPTION_MAX_LENGTH, taskSchema, type TaskFormData } from '../schemas/taskSchema'
import { CATEGORIES, DEFAULT_CATEGORY, PRIORITIES, PRIORITY_LABELS, type Task } from '../types/task'
import StatusMessage from './StatusMessage'
import './TaskFormDialog.scss'

export interface TaskFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  /** Початкові дані для режиму edit. */
  task?: Task
  onClose: () => void
  /** Збереження; dialog закриває батьківський компонент після успіху. */
  onSubmit: (data: TaskFormData) => Promise<void>
}

const EMPTY_VALUES: TaskFormData = {
  title: '',
  description: '',
  category: DEFAULT_CATEGORY,
  priority: 'medium',
}

function toFormValues(task?: Task): TaskFormData {
  if (!task) return EMPTY_VALUES
  const category = CATEGORIES.find((item) => item === task.category) ?? DEFAULT_CATEGORY
  return { title: task.title, description: task.description, category, priority: task.priority }
}

/** Одна форма для двох сценаріїв: створення (кнопка «+») і редагування (сторінка деталей). */
function TaskFormDialog({ open, mode, task, onClose, onSubmit }: TaskFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const id = useId()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({ resolver: zodResolver(taskSchema), defaultValues: EMPTY_VALUES })

  // Нативний <dialog>.showModal(): фокус усередині вікна, решта сторінки неактивна, Escape закриває.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      reset(toFormValues(task))
      dialog.showModal()
      // showModal() фокусує перший елемент (кнопку ×) — переводимо фокус на поле «Назва»
      dialog.querySelector<HTMLInputElement>('input[name="title"]')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open, task, reset])

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    // Escape: закриваємо через стан батька; під час збереження — ігноруємо
    event.preventDefault()
    if (!isSubmitting) onClose()
  }

  const submit = handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      setError('root', { message: getErrorMessage(error) })
    }
  })

  const titleId = `${id}-heading`

  return (
    <dialog ref={dialogRef} className="task-dialog" aria-labelledby={titleId} onCancel={handleCancel}>
      <form className="task-dialog__form" onSubmit={submit} noValidate>
        <header className="task-dialog__header">
          <h2 id={titleId} className="task-dialog__title">
            {mode === 'create' ? 'Нове завдання' : 'Редагування завдання'}
          </h2>
          <button
            type="button"
            className="task-dialog__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Закрити"
          >
            ×
          </button>
        </header>

        <fieldset className="task-dialog__fieldset" disabled={isSubmitting}>
          <div className={`field${errors.title ? ' field--invalid' : ''}`}>
            <label className="field__label" htmlFor={`${id}-title`}>
              Назва *
            </label>
            <input
              id={`${id}-title`}
              className="field__control"
              autoComplete="off"
              placeholder="Наприклад, вивчити React Router"
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? `${id}-title-error` : undefined}
              {...register('title')}
            />
            {errors.title && (
              <span id={`${id}-title-error`} className="field__error">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className={`field${errors.description ? ' field--invalid' : ''}`}>
            <label className="field__label" htmlFor={`${id}-description`}>
              Опис
            </label>
            <textarea
              id={`${id}-description`}
              className="field__control task-dialog__textarea"
              rows={3}
              maxLength={DESCRIPTION_MAX_LENGTH + 50}
              placeholder="Коротко, що потрібно зробити"
              aria-invalid={errors.description ? true : undefined}
              {...register('description')}
            />
            {errors.description && <span className="field__error">{errors.description.message}</span>}
          </div>

          <div className="task-dialog__row">
            <div className="field">
              <label className="field__label" htmlFor={`${id}-category`}>
                Категорія
              </label>
              <select id={`${id}-category`} className="field__control" {...register('category')}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${id}-priority`}>
                Пріоритет
              </label>
              <select id={`${id}-priority`} className="field__control" {...register('priority')}>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITY_LABELS[priority]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <p className="task-dialog__note">
          Опис, категорія й пріоритет зберігаються лише на клієнті — DummyJSON їх не підтримує.
        </p>

        {errors.root && (
          <StatusMessage variant="error" compact>
            {errors.root.message}
          </StatusMessage>
        )}

        <footer className="task-dialog__actions">
          <button type="button" className="button button--ghost" onClick={onClose} disabled={isSubmitting}>
            Скасувати
          </button>
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Збереження…' : mode === 'create' ? 'Створити' : 'Зберегти'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}

export default TaskFormDialog
