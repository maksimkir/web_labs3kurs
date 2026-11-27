import { useContext } from 'react'
import { TaskContext, type TaskContextValue } from '../context/task-context'

/** Зручний доступ до TaskContext з перевіркою, що компонент усередині TaskProvider. */
export function useTaskContext(): TaskContextValue {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used inside <TaskProvider>. Wrap the app in TaskProvider.')
  }
  return context
}
