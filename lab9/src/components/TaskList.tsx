import type { NewTask, Task } from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

interface TaskListProps {
  /** Завдання після фільтрації. */
  tasks: Task[]
  /** Скільки завдань є взагалі (до фільтрації). */
  totalCount: number
  onToggle: (id: number) => void
  onUpdate: (id: number, changes: NewTask) => void
  onDelete: (id: number) => void
}

function TaskList({ tasks, totalCount, onToggle, onUpdate, onDelete }: TaskListProps) {
  // умовний рендеринг: окремі повідомлення для порожнього списку і порожнього фільтра
  if (totalCount === 0) {
    return (
      <div className="task-list__empty">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p>Додайте перше навчальне завдання.</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>За цим фільтром завдань немає.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        // стабільний key — id завдання, а не індекс масиву
        <TaskItem key={task.id} task={task} onToggle={onToggle} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
