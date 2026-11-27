import type { AsyncStatus } from '../types/async'
import type { Task } from '../types/task'

/** Server state списку: дані поточної сторінки, отримані через API, та стан запиту. */
export interface TaskListState {
  status: AsyncStatus
  tasks: Task[]
  total: number
  error: string | null
}

export type TaskListAction =
  | { type: 'fetchStart' }
  | { type: 'fetchSuccess'; tasks: Task[]; total: number }
  | { type: 'fetchError'; error: string }
  | { type: 'taskCreated'; task: Task }
  | { type: 'taskUpdated'; task: Task }
  | { type: 'taskRemoved'; id: number }

export const initialTaskListState: TaskListState = {
  status: 'loading',
  tasks: [],
  total: 0,
  error: null,
}

/** Чиста функція без HTTP: запити виконує hook, reducer лише оновлює стан за результатом. */
export function taskListReducer(state: TaskListState, action: TaskListAction): TaskListState {
  switch (action.type) {
    case 'fetchStart':
      // попередні дані лишаються на екрані, поки вантажиться нова сторінка
      return { ...state, status: 'loading', error: null }

    case 'fetchSuccess':
      return { status: 'success', tasks: action.tasks, total: action.total, error: null }

    case 'fetchError':
      // дані іншої сторінки вже неактуальні — повтор запиту почнеться з чистого loading state
      return { status: 'error', tasks: [], total: state.total, error: action.error }

    // після mutation-операцій оновлюємо client state без повторного GET
    case 'taskCreated':
      return { ...state, tasks: [action.task, ...state.tasks], total: state.total + 1 }

    case 'taskUpdated':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.task.id ? action.task : task)),
      }

    case 'taskRemoved':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.id),
        total: Math.max(0, state.total - 1),
      }

    default:
      return state
  }
}
