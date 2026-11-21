export type Priority = 'low' | 'medium' | 'high'

/** Domain-модель, з якою працює UI. Не збігається з DTO API (ApiTodo). */
export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
}

/** Дані з форми: id і completed задає застосунок. */
export type NewTask = Omit<Task, 'id' | 'completed'>

/** Часткове оновлення існуючого завдання. */
export type TaskChanges = Partial<Omit<Task, 'id'>>

export interface TaskPage {
  tasks: Task[]
  total: number
  page: number
  pageSize: number
}

export type TaskFilter = 'all' | 'active' | 'completed'

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

export const DEFAULT_CATEGORY = 'Загальне'

export const CATEGORIES = [DEFAULT_CATEGORY, 'React', 'TypeScript', 'JavaScript', 'CSS', 'Git'] as const
