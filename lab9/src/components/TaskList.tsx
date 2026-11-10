import { useTaskContext } from '../hooks/useTaskContext'
import TaskItem from './TaskItem'
import './TaskList.scss'

function TaskList() {
  const { tasks, visibleTasks } = useTaskContext()

  // умовний рендеринг: окремі повідомлення для порожнього списку і порожнього фільтра
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p>Додайте перше навчальне завдання.</p>
      </div>
    )
  }

  if (visibleTasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>За цим фільтром завдань немає.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        // стабільний key — id завдання, а не індекс масиву
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
