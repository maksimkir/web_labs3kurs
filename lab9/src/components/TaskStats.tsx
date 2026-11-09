import { useTaskContext } from '../hooks/useTaskContext'
import './TaskStats.scss'

function TaskStats() {
  // лічильники обчислюються з поточного масиву в контексті — окремий state не потрібен
  const { counts } = useTaskContext()
  const { all: total, completed, active } = counts
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  const items = [
    { label: 'Усього', value: total, modifier: 'total' },
    { label: 'Виконано', value: completed, modifier: 'completed' },
    { label: 'Не виконано', value: active, modifier: 'active' },
  ]

  return (
    <section className="task-stats" aria-label="Статистика завдань">
      <dl className="task-stats__list">
        {items.map((item) => (
          <div key={item.modifier} className={`task-stats__item task-stats__item--${item.modifier}`}>
            <dt className="task-stats__label">{item.label}</dt>
            <dd className="task-stats__value">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div
        className="task-stats__progress"
        role="progressbar"
        aria-label="Прогрес виконання"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="task-stats__progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="task-stats__caption">Виконано {progress}%</p>
    </section>
  )
}

export default TaskStats
