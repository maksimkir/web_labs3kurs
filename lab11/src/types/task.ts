export type Priority = 'low' | 'medium' | 'high'

/** Domain-модель, з якою працює UI. Не збігається з DTO API (ApiTodo). */
export interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
  /**
   * Хто створив. Для завдань з API — похідне від userId (сервер не повертає імені);
   * для створених у застосунку — username поточного користувача (client-owned).
   */
  createdBy: string
  /**
   * Дата створення, ISO-рядок. CLIENT-OWNED METADATA: DummyJSON такого поля не має,
   * тому для завдань із сервера значення невідоме (null), а для створених тут — момент створення.
   */
  createdAt: string | null
}

/** Дані з форми: решту полів задає застосунок. */
export type NewTask = Pick<Task, 'title' | 'description' | 'priority' | 'category'>

/** Автор нового завдання — поточний користувач. */
export interface TaskAuthor {
  id: number
  username: string
}

/** Часткове оновлення існуючого завдання. */
export type TaskChanges = Partial<Omit<Task, 'id' | 'createdBy' | 'createdAt'>>

export interface TaskPage {
  tasks: Task[]
  total: number
  page: number
  pageSize: number
}

export type TaskFilter = 'all' | 'active' | 'completed'

export const PRIORITIES = ['low', 'medium', 'high'] as const satisfies readonly Priority[]

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
}

export const DEFAULT_CATEGORY = 'Загальне'

export const CATEGORIES = [DEFAULT_CATEGORY, 'React', 'TypeScript', 'JavaScript', 'CSS', 'Git'] as const
