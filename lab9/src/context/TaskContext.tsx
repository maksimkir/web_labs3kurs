import { useCallback, useMemo, useReducer, useState, type ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { taskReducer } from '../reducers/taskReducer'
import { PRIORITY_ORDER, type NewTask, type TaskFilter } from '../types/task'
import { TaskContext, type TaskContextValue } from './task-context'

export function TaskProvider({ children }: { children: ReactNode }) {
  // tasks — єдине джерело правди, ним керує reducer
  const [state, dispatch] = useReducer(taskReducer, { tasks: initialTasks, pendingDelete: null })
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [search, setSearch] = useState('')
  const [sortByPriority, setSortByPriority] = useState(false)

  const { tasks, pendingDelete } = state

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
  const addTask = useCallback((task: NewTask) => dispatch({ type: 'add', task }), [])
  const updateTask = useCallback(
    (id: number, changes: NewTask) => dispatch({ type: 'update', id, changes }),
    [],
  )
  const toggleTask = useCallback((id: number) => dispatch({ type: 'toggle', id }), [])
  const requestDelete = useCallback((id: number) => {
    // тимчасово видаляємо одразу; Undoable Delete з таймером з'явиться пізніше
    dispatch({ type: 'requestDelete', id })
    dispatch({ type: 'confirmDelete' })
  }, [])
  const undoDelete = useCallback(() => dispatch({ type: 'undoDelete' }), [])
  const clearCompleted = useCallback(() => {
    dispatch({ type: 'clearCompleted' })
    dispatch({ type: 'confirmDelete' })
  }, [])
  const resetTasks = useCallback(() => dispatch({ type: 'reset', tasks: initialTasks }), [])

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
    }),
    [
      tasks,
      visibleTasks,
      counts,
      pendingDelete,
      filter,
      search,
      sortByPriority,
      addTask,
      updateTask,
      toggleTask,
      requestDelete,
      undoDelete,
      clearCompleted,
      resetTasks,
    ],
  )

  return <TaskContext value={value}>{children}</TaskContext>
}
