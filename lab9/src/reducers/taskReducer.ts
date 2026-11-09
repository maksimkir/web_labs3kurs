import type { PendingDelete, Task, TaskAction, TaskState } from '../types/task'

// Остаточно прибирає завдання, які очікували видалення.
function withoutPending(state: TaskState): Task[] {
  if (!state.pendingDelete) return state.tasks
  const ids = new Set(state.pendingDelete.taskIds)
  return state.tasks.filter((task) => !ids.has(task.id))
}

function schedule(state: TaskState, taskIds: number[], label: string): TaskState {
  // одночасно активне лише одне видалення: попереднє завершується одразу
  const pendingDelete: PendingDelete = {
    key: (state.pendingDelete?.key ?? 0) + 1,
    taskIds,
    label,
  }
  return { tasks: withoutPending(state), pendingDelete }
}

/**
 * Чиста функція: (стан, дія) → новий стан.
 * Без HTTP-запитів, DOM, localStorage, таймерів і UI-логіки — лише незмінні оновлення.
 */
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add': {
      const id = Math.max(0, ...state.tasks.map((task) => task.id)) + 1
      return { ...state, tasks: [{ ...action.task, id, completed: false }, ...state.tasks] }
    }

    case 'toggle':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id ? { ...task, completed: !task.completed } : task,
        ),
      }

    case 'update':
      return {
        ...state,
        tasks: state.tasks.map((task) => (task.id === action.id ? { ...task, ...action.changes } : task)),
      }

    case 'requestDelete': {
      const task = state.tasks.find((item) => item.id === action.id)
      if (!task || state.pendingDelete?.taskIds.includes(task.id)) return state
      return schedule(state, [task.id], `«${task.title}»`)
    }

    case 'clearCompleted': {
      const ids = state.tasks
        .filter((task) => task.completed && !state.pendingDelete?.taskIds.includes(task.id))
        .map((task) => task.id)
      if (ids.length === 0) return state
      return schedule(state, ids, `виконані завдання (${ids.length})`)
    }

    case 'confirmDelete':
      if (!state.pendingDelete) return state
      return { tasks: withoutPending(state), pendingDelete: null }

    case 'undoDelete':
      return { ...state, pendingDelete: null }

    case 'reset':
      return { tasks: action.tasks, pendingDelete: null }

    default:
      return state
  }
}
