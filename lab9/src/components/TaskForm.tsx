import { useId, useState, type ChangeEvent, type FormEvent } from 'react'
import { CATEGORIES } from '../data/initialTasks'
import { PRIORITY_LABELS, type NewTask, type Priority } from '../types/task'
import './TaskForm.scss'

interface TaskFormProps {
  onSubmit: (task: NewTask) => void
  /** Значення для режиму редагування; без них форма створює нове завдання. */
  initialValues?: NewTask
  onCancel?: () => void
}

const TITLE_MAX_LENGTH = 80

const EMPTY_FORM: NewTask = {
  title: '',
  description: '',
  category: CATEGORIES[0],
  priority: 'medium',
}

function validateTitle(title: string): string | null {
  if (!title.trim()) return 'Введіть назву завдання'
  if (title.trim().length > TITLE_MAX_LENGTH) return `Не більше ${TITLE_MAX_LENGTH} символів`
  return null
}

function TaskForm({ onSubmit, initialValues, onCancel }: TaskFormProps) {
  const isEditing = initialValues !== undefined
  // useId дає унікальні id полів: на сторінці може бути кілька форм (створення й редагування)
  const id = useId()
  // керована форма: усі значення полів зберігаються в одному об'єкті стану
  const [values, setValues] = useState<NewTask>(initialValues ?? EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)

  // помилка обчислюється з поточного стану, окремий state для неї не потрібен
  const titleError = submitted ? validateTitle(values.title) : null

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target
    // незмінне оновлення об'єкта: копія з одним зміненим полем
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (validateTitle(values.title)) {
      setSubmitted(true)
      return
    }
    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    })
    if (!isEditing) {
      // після успішного додавання форма очищується
      setValues(EMPTY_FORM)
      setSubmitted(false)
    }
  }

  return (
    <form className={`task-form${isEditing ? ' task-form--editing' : ''}`} onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">{isEditing ? 'Редагування завдання' : 'Нове завдання'}</h2>

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
          placeholder="Наприклад, вивчити useState"
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

      <div className="task-form__actions">
        <button type="submit" className="button button--primary">
          {isEditing ? 'Зберегти' : 'Додати'}
        </button>
        {onCancel && (
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
