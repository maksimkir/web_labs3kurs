export type Priority = 'low' | 'medium' | 'high'

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

export type TaskFilter = 'all' | 'active' | 'completed'

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

/** Порядок для сортування: спершу важливіші завдання. */
export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}
