import { useState, type ChangeEvent, type FormEvent } from 'react'
import { CATEGORIES } from '../data/initialTasks'
import { PRIORITY_LABELS, type NewTask, type Priority } from '../types/task'
import './TaskForm.scss'

interface TaskFormProps {
  onAdd: (task: NewTask) => void
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

function TaskForm({ onAdd }: TaskFormProps) {
  // керована форма: усі значення полів зберігаються в одному об'єкті стану
  const [values, setValues] = useState<NewTask>(EMPTY_FORM)
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
    onAdd({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    })
    // після успішного додавання форма очищується
    setValues(EMPTY_FORM)
    setSubmitted(false)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__title">Нове завдання</h2>

      <div className={`field${titleError ? ' field--invalid' : ''}`}>
        <label className="field__label" htmlFor="task-title">
          Назва *
        </label>
        <input
          id="task-title"
          className="field__control"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Наприклад, вивчити useState"
          maxLength={TITLE_MAX_LENGTH + 20}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? 'task-title-error' : undefined}
          autoComplete="off"
        />
        {titleError && (
          <span id="task-title-error" className="field__error">
            {titleError}
          </span>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="task-description">
          Опис
        </label>
        <textarea
          id="task-description"
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
          <label className="field__label" htmlFor="task-category">
            Категорія
          </label>
          <select
            id="task-category"
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
          <label className="field__label" htmlFor="task-priority">
            Пріоритет
          </label>
          <select
            id="task-priority"
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

      <button type="submit" className="button button--primary task-form__submit">
        Додати
      </button>
    </form>
  )
}

export default TaskForm
