import './TaskSearch.scss'

interface TaskSearchProps {
  value: string
  onChange: (value: string) => void
  /** true, поки debounce ще не застосував введене значення. */
  isPending: boolean
}

function TaskSearch({ value, onChange, isPending }: TaskSearchProps) {
  return (
    <div className="task-search">
      <div className="field task-search__field">
        <label className="visually-hidden" htmlFor="task-search">
          Пошук за назвою
        </label>
        <input
          id="task-search"
          className="field__control"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Пошук на сторінці за назвою..."
          autoComplete="off"
        />
      </div>
      {isPending && <span className="task-search__hint">Пошук…</span>}
    </div>
  )
}

export default TaskSearch
