import { useState } from 'react'
import { useTaskContext } from '../hooks/useTaskContext'
import { PRIORITY_LABELS, type Task } from '../types/task'
import TaskForm from './TaskForm'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
}

function TaskItem({ task }: TaskItemProps) {
  // дії беремо з контексту — їх не потрібно передавати через TaskList
  const { toggleTask: onToggle, updateTask: onUpdate, requestDelete: onDelete, pendingDelete } =
    useTaskContext()
  const isPending = pendingDelete?.taskIds.includes(task.id) ?? false
  // режим редагування — локальний UI-стан картки, іншим компонентам він не потрібен
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    const { title, description, category, priority } = task
    return (
      <li className="task-item task-item--editing">
        <TaskForm
          initialValues={{ title, description, category, priority }}
          onSubmit={(changes) => {
            onUpdate(task.id, changes)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    )
  }

  return (
    <li
      className={`task-item${task.completed ? ' task-item--completed' : ''}${isPending ? ' task-item--pending' : ''}`}
      aria-disabled={isPending || undefined}
    >
      <div className="task-item__body">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta">
          <span className="task-item__category">{task.category}</span>
          <span className={`task-item__priority task-item__priority--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="task-item__status">{task.completed ? 'Виконано' : 'Не виконано'}</span>
          {isPending && <span className="task-item__pending">Буде видалено</span>}
        </div>
      </div>
      <div className="task-item__actions">
        <button
          type="button"
          className={`button button--small${task.completed ? '' : ' button--primary'}`}
          onClick={() => onToggle(task.id)}
          aria-pressed={task.completed}
          disabled={isPending}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
        </button>
        <button
          type="button"
          className="button button--small"
          onClick={() => setIsEditing(true)}
          disabled={isPending}
        >
          Редагувати
        </button>
        <button
          type="button"
          className="button button--small button--danger"
          onClick={() => onDelete(task.id)}
          aria-label={`Видалити завдання «${task.title}»`}
          disabled={isPending}
        >
          Видалити
        </button>
      </div>
    </li>
  )
}

export default TaskItem
