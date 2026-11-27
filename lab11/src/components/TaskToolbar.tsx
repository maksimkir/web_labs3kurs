import { PRIORITIES, PRIORITY_LABELS, type Priority } from '../types/task'
import './TaskToolbar.scss'

interface TaskToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  /** true, поки debounce ще не застосував введене значення. */
  isSearchPending: boolean
  priority: Priority | null
  onPriorityChange: (priority: Priority | null) => void
}

function TaskToolbar({ search, onSearchChange, isSearchPending, priority, onPriorityChange }: TaskToolbarProps) {
  return (
    <div className="task-toolbar">
      <div className="field task-toolbar__search">
        <label className="visually-hidden" htmlFor="task-search">
          Пошук за назвою
        </label>
        <input
          id="task-search"
          className="field__control"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Пошук на сторінці за назвою..."
          autoComplete="off"
        />
      </div>

      <div className="field task-toolbar__priority">
        <label className="visually-hidden" htmlFor="task-priority">
          Пріоритет
        </label>
        <select
          id="task-priority"
          className="field__control"
          value={priority ?? ''}
          onChange={(event) => onPriorityChange((event.target.value || null) as Priority | null)}
        >
          <option value="">Будь-який пріоритет</option>
          {PRIORITIES.map((item) => (
            <option key={item} value={item}>
              {PRIORITY_LABELS[item]}
            </option>
          ))}
        </select>
      </div>

      {isSearchPending && <span className="task-toolbar__hint">Пошук…</span>}
    </div>
  )
}

export default TaskToolbar
