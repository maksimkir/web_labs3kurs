import { useTaskContext } from '../hooks/useTaskContext'
import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
]

function TaskFilters() {
  const { filter: value, setFilter: onChange, counts } = useTaskContext()

  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`task-filters__button${filter.value === value ? ' task-filters__button--active' : ''}`}
          aria-pressed={filter.value === value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
          <span className="task-filters__count">{counts[filter.value]}</span>
        </button>
      ))}
    </div>
  )
}

export default TaskFilters
