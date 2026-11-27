import type { Task } from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

interface TaskListProps {
  tasks: Task[]
  onToggle: (task: Task) => Promise<void>
  onRequestDelete: () => boolean
  onDelete: (id: number) => Promise<void>
  /** Під час завантаження нової сторінки старі дані приглушуються. */
  isStale?: boolean
}

function TaskList({ tasks, isStale = false, ...handlers }: TaskListProps) {
  return (
    <ul className={`task-list${isStale ? ' task-list--stale' : ''}`} aria-busy={isStale || undefined}>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} {...handlers} />
      ))}
    </ul>
  )
}

export default TaskList
