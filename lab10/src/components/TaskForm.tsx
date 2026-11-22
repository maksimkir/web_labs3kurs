import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { getErrorMessage } from '../api/errors'
import { CATEGORIES, DEFAULT_CATEGORY, PRIORITY_LABELS, type NewTask, type Priority } from '../types/task'
import StatusMessage from './StatusMessage'
import './TaskForm.scss'

interface TaskFormProps {
  /** Асинхронне збереження: форма показує стан відправки, успіху або помилки. */
  onSubmit: (task: NewTask) => Promise<unknown>
  /** Значення для режиму редагування; без них форма створює нове завдання. */
  initialValues?: NewTask
  onCancel?: () => void
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const TITLE_MAX_LENGTH = 80

const EMPTY_FORM: NewTask = {
  title: '',
  description: '',
  category: DEFAULT_CATEGORY,
  priority: 'medium',
}

function validateTitle(title: string): string | null {
  if (!title.trim()) return 'Введіть назву завдання'
  if (title.trim().length > TITLE_MAX_LENGTH) return `Не більше ${TITLE_MAX_LENGTH} символів`
  return null
}

function TaskForm({ onSubmit, initialValues, onCancel }: TaskFormProps) {
  const isEditing = initialValues !== undefined
  const id = useId()
  // стан форми — client/UI state, він не потрапляє в server state
  const [values, setValues] = useState<NewTask>(initialValues ?? EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })
  const isSubmitting = submitState.status === 'submitting'

  const titleError = submitted ? validateTitle(values.title) : null

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (submitState.status === 'success') setSubmitState({ status: 'idle' })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (validateTitle(values.title)) {
      setSubmitted(true)
      return
    }
    setSubmitState({ status: 'submitting' })
    try {
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
      })
      if (!isEditing) {
        // після успішного створення форма очищується й показує inline-повідомлення
        setValues(EMPTY_FORM)
        setSubmitted(false)
        setSubmitState({ status: 'success', message: 'Завдання створено' })
      }
    } catch (error) {
      setSubmitState({ status: 'error', message: getErrorMessage(error) })
    }
  }

  return (
    <form className={`task-form${isEditing ? ' task-form--editing' : ''}`} onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">{isEditing ? 'Редагування завдання' : 'Нове завдання'}</h2>

      <fieldset className="task-form__fieldset" disabled={isSubmitting}>
        <div className={`field${titleError ? ' field--invalid' : ''}`}>
          <label className="field__label" htmlFor={`${id}-title`}>
            Назва *
          </label>
          <input
            id={`${id}-title`}
            className="field__control"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Наприклад, вивчити AbortController"
            maxLength={TITLE_MAX_LENGTH + 20}
            aria-invalid={titleError ? true : undefined}
            aria-describedby={titleError ? `${id}-title-error` : undefined}
            autoComplete="off"
          />
          {titleError && (
            <span id={`${id}-title-error`} className="field__error">
              {titleError}
            </span>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${id}-description`}>
            Опис
          </label>
          <textarea
            id={`${id}-description`}
            className="field__control task-form__textarea"
            name="description"
            value={values.description}
            onChange={handleChange}
            placeholder="Коротко, що потрібно зробити"
            rows={3}
          />
        </div>

        <div className="task-form__row">
          <div className="field">
            <label className="field__label" htmlFor={`${id}-category`}>
              Категорія
            </label>
            <select
              id={`${id}-category`}
              className="field__control"
              name="category"
              value={values.category}
              onChange={handleChange}
            >
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
            <select
              id={`${id}-priority`}
              className="field__control"
              name="priority"
              value={values.priority}
              onChange={handleChange}
            >
              {(Object.keys(PRIORITY_LABELS) as Priority[]).map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_LABELS[priority]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <p className="task-form__note">Опис, категорія й пріоритет зберігаються лише на клієнті — DummyJSON їх не підтримує.</p>

      {submitState.status === 'success' && (
        <StatusMessage variant="success" compact>
          {submitState.message}
        </StatusMessage>
      )}
      {submitState.status === 'error' && (
        <StatusMessage variant="error" compact>
          {submitState.message}
        </StatusMessage>
      )}

      <div className="task-form__actions">
        <button type="submit" className="button button--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Збереження…' : isEditing ? 'Зберегти' : 'Додати'}
        </button>
        {onCancel && (
          <button type="button" className="button button--ghost" onClick={onCancel} disabled={isSubmitting}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
