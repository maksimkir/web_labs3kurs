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

/** Заплановане видалення, яке ще можна скасувати (Undoable Delete). */
export interface PendingDelete {
  /** Номер операції: змінюється з кожним новим видаленням (перезапуск таймера й прогресу). */
  key: number
  taskIds: number[]
  /** Текст для повідомлення: назва завдання або «3 виконаних завдання». */
  label: string
}

export interface TaskState {
  tasks: Task[]
  pendingDelete: PendingDelete | null
}

// Кожна дія reducer-а — окремий тип з власним payload.
export type TaskAction =
  | { type: 'add'; task: NewTask }
  | { type: 'toggle'; id: number }
  | { type: 'update'; id: number; changes: NewTask }
  | { type: 'requestDelete'; id: number }
  | { type: 'clearCompleted' }
  | { type: 'confirmDelete' }
  | { type: 'undoDelete' }
  | { type: 'reset'; tasks: Task[] }
