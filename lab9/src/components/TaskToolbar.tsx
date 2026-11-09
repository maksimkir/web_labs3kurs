import { useTaskContext } from '../hooks/useTaskContext'
import './TaskToolbar.scss'

function TaskToolbar() {
  const {
    search,
    setSearch: onSearchChange,
    sortByPriority,
    setSortByPriority: onSortByPriorityChange,
    counts,
    clearCompleted: onClearCompleted,
  } = useTaskContext()
  const completedCount = counts.completed

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
          placeholder="Пошук за назвою..."
          autoComplete="off"
        />
      </div>

      <label className="task-toolbar__checkbox">
        <input
          type="checkbox"
          checked={sortByPriority}
          onChange={(event) => onSortByPriorityChange(event.target.checked)}
        />
        За пріоритетом
      </label>

      {/* кнопка має сенс лише тоді, коли є виконані завдання */}
      {completedCount > 0 && (
        <button type="button" className="button button--small button--danger" onClick={onClearCompleted}>
          Очистити виконані ({completedCount})
        </button>
      )}
    </div>
  )
}

export default TaskToolbar
