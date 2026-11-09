import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { initialTasks } from '../data/initialTasks'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useToasts } from '../hooks/useToasts'
import { taskReducer } from '../reducers/taskReducer'
import { PRIORITY_ORDER, type NewTask, type TaskFilter, type TaskState } from '../types/task'
import { loadTasks, saveTasks } from '../utils/taskStorage'
import { TaskContext, type TaskContextValue } from './task-context'

/** Скільки часу є, щоб скасувати видалення. */
export const UNDO_DELAY_MS = 5000

const FILTERS: readonly TaskFilter[] = ['all', 'active', 'completed']

function isTaskFilter(value: unknown): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter)
}

// Початковий стан reducer-а: збережені завдання або, якщо їх немає чи вони пошкоджені, — початковий список.
function initState(): TaskState {
  return { tasks: loadTasks() ?? initialTasks, pendingDelete: null }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  // tasks — єдине джерело правди, ним керує reducer; localStorage лише зберігає їх між сесіями
  const [state, dispatch] = useReducer(taskReducer, undefined, initState)
  // активний фільтр зберігається через власний hook
  const [filter, setFilter] = useLocalStorage<TaskFilter>('study-planner:filter', 'all', isTaskFilter)
  const [search, setSearch] = useState('')
  const [sortByPriority, setSortByPriority] = useState(false)
  const { toasts, toast, dismiss: dismissToast } = useToasts()

  const { tasks, pendingDelete } = state

  // useEffectEvent: функція бачить актуальні pendingDelete і toast, але не є залежністю ефекту,
  // тому зміна toast чи інших даних не перезапускає 5-секундний таймер
  const onUndoTimeout = useEffectEvent(() => {
    if (!pendingDelete) return
    dispatch({ type: 'confirmDelete' })
    toast.success(`Видалено: ${pendingDelete.label}`)
  })

  // Undoable Delete: таймер — побічний ефект, тому він тут, а не в reducer.
  // Новий pendingDelete.key перезапускає таймер; cleanup очищує попередній
  // (при скасуванні, новому видаленні або unmount провайдера).
  const pendingKey = pendingDelete?.key
  useEffect(() => {
    if (pendingKey === undefined) return
    const timer = setTimeout(onUndoTimeout, UNDO_DELAY_MS)
    return () => clearTimeout(timer)
  }, [pendingKey])

  // після кожної зміни tasks синхронізуємо їх з localStorage (побічний ефект)
  useEffect(() => {
    if (!saveTasks(tasks)) toast.error('Не вдалося зберегти завдання в браузері')
  }, [tasks, toast])

  // похідні дані обчислюються під час рендеру, а не зберігаються окремим state
  const counts = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length
    return { all: tasks.length, completed, active: tasks.length - completed }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = tasks.filter((task) => {
      if (filter === 'completed' && !task.completed) return false
      if (filter === 'active' && task.completed) return false
      return task.title.toLowerCase().includes(query)
    })
    return sortByPriority
      ? [...filtered].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
      : filtered
  }, [tasks, filter, search, sortByPriority])

  // useCallback: дії зберігають ту саму функцію між рендерами
  const addTask = useCallback(
    (task: NewTask) => {
      dispatch({ type: 'add', task })
      toast.success(`Завдання «${task.title}» додано`)
    },
    [toast],
  )
  const updateTask = useCallback(
    (id: number, changes: NewTask) => {
      dispatch({ type: 'update', id, changes })
      toast.success('Зміни збережено')
    },
    [toast],
  )
  const toggleTask = useCallback((id: number) => dispatch({ type: 'toggle', id }), [])
  const requestDelete = useCallback(
    (id: number) => {
      // одночасно лише одне видалення: попереднє reducer завершує одразу
      if (pendingDelete) toast.success(`Видалено: ${pendingDelete.label}`)
      dispatch({ type: 'requestDelete', id })
    },
    [pendingDelete, toast],
  )
  const undoDelete = useCallback(() => {
    dispatch({ type: 'undoDelete' })
    toast.info('Видалення скасовано')
  }, [toast])
  const clearCompleted = useCallback(() => {
    if (counts.completed === 0) {
      toast.error('Немає виконаних завдань для очищення')
      return
    }
    dispatch({ type: 'clearCompleted' })
    dispatch({ type: 'confirmDelete' })
  }, [counts.completed, toast])
  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset', tasks: initialTasks })
    toast.info('Дані скинуто до початкового списку')
  }, [toast])

  // useMemo: новий об'єкт value (і перерендер споживачів) лише коли змінилися дані
  const value = useMemo<TaskContextValue>(
    () => ({
      tasks,
      visibleTasks,
      counts,
      pendingDelete,
      filter,
      setFilter,
      search,
      setSearch,
      sortByPriority,
      setSortByPriority,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      toast,
      toasts,
      dismissToast,
    }),
    [
      tasks,
      visibleTasks,
      counts,
      pendingDelete,
      filter,
      setFilter,
      search,
      sortByPriority,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
      toast,
      toasts,
      dismissToast,
    ],
  )

  return <TaskContext value={value}>{children}</TaskContext>
}
