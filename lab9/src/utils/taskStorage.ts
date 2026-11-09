import type { Priority, Task } from '../types/task'

export const TASKS_STORAGE_KEY = 'study-planner:tasks'

const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high']

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === 'number' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.category === 'string' &&
    PRIORITIES.includes(task.priority as Priority)
  )
}

/** Розбирає збережений рядок; null, якщо даних немає або вони пошкоджені. */
export function parseTasks(raw: string | null): Task[] | null {
  if (raw === null) return null
  try {
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) && data.every(isTask) ? data : null
  } catch {
    // пошкоджений JSON не повинен ламати застосунок
    return null
  }
}

export function loadTasks(): Task[] | null {
  try {
    return parseTasks(localStorage.getItem(TASKS_STORAGE_KEY))
  } catch {
    // localStorage може бути недоступний (приватний режим, заборона браузера)
    return null
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // сховище переповнене або недоступне — дані лишаються в пам'яті
  }
}
