import type { TaskFilter } from '../types/task'
import './TaskStats.scss'

interface TaskStatsProps {
  /** Загальна кількість завдань в API. */
  total: number
  /** Лічильники для поточної сторінки. */
  pageCounts: Record<TaskFilter, number>
}

function TaskStats({ total, pageCounts }: TaskStatsProps) {
  const { all, completed, active } = pageCounts
  const progress = all === 0 ? 0 : Math.round((completed / all) * 100)

  const items = [
    { label: 'Усього в API', value: total, modifier: 'total' },
    { label: 'Виконано (стор.)', value: completed, modifier: 'completed' },
    { label: 'Не виконано (стор.)', value: active, modifier: 'active' },
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
        aria-label="Прогрес виконання на сторінці"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="task-stats__progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="task-stats__caption">На цій сторінці виконано {progress}%</p>
    </section>
  )
}

export default TaskStats
