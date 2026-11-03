import type { TaskFilter } from '../types/task'
import './TaskFilters.scss'

interface TaskFiltersProps {
  value: TaskFilter
  onChange: (filter: TaskFilter) => void
  /** Кількість завдань для кожного фільтра — показується в кнопках. */
  counts: Record<TaskFilter, number>
}

const FILTERS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Всі' },
  { value: 'completed', label: 'Виконані' },
  { value: 'active', label: 'Не виконані' },
]

function TaskFilters({ value, onChange, counts }: TaskFiltersProps) {
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
