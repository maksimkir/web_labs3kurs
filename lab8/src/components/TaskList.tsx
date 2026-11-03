import type { Task } from '../types/task'
import TaskItem from './TaskItem'
import './TaskList.scss'

interface TaskListProps {
  tasks: Task[]
}

function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        // стабільний key — id завдання, а не індекс масиву
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}

export default TaskList
