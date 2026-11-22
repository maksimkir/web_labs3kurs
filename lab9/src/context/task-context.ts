import { createContext } from 'react'
import type { NewTask, PendingDelete, Task, TaskFilter } from '../types/task'
import type { ToastApi, ToastMessage } from '../types/toast'

export interface TaskContextValue {
  tasks: Task[]
  /** Завдання після фільтра, пошуку й сортування (обчислюються під час рендеру). */
  visibleTasks: Task[]
  counts: Record<TaskFilter, number>
  pendingDelete: PendingDelete | null
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  search: string
  setSearch: (search: string) => void
  sortByPriority: boolean
  setSortByPriority: (value: boolean) => void
  addTask: (task: NewTask) => void
  updateTask: (id: number, changes: NewTask) => void
  toggleTask: (id: number) => void
  requestDelete: (id: number) => void
  undoDelete: () => void
  clearCompleted: () => void
  resetTasks: () => void
  /** Показ сповіщень: toast.success(...), toast.error(...). */
  toast: ToastApi
  toasts: ToastMessage[]
  dismissToast: (id: number) => void
}

// Окремий модуль лише для об'єкта контексту: провайдер і хук імпортують його звідси.
export const TaskContext = createContext<TaskContextValue | null>(null)
