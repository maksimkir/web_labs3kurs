import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '../api/errors'
import Pagination from '../components/Pagination'
import StatusMessage from '../components/StatusMessage'
import TaskDetails from '../components/TaskDetails'
import TaskFilters from '../components/TaskFilters'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import TaskSearch from '../components/TaskSearch'
import TaskStats from '../components/TaskStats'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useTaskList } from '../hooks/useTaskList'
import { useToast } from '../hooks/useToast'
import type { NewTask, Task, TaskFilter } from '../types/task'
import './StudyPlannerPage.scss'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400
const FILTERS: readonly TaskFilter[] = ['all', 'active', 'completed']

function isTaskFilter(value: unknown): value is TaskFilter {
  return FILTERS.includes(value as TaskFilter)
}

function StudyPlannerPage() {
  // client/UI state: сторінка, фільтр, пошук, вибране завдання
  const [page, setPage] = useState(1)
  // localStorage використовується лише для UI-стану (фільтр), не для даних з API
  const [filter, setFilter] = useLocalStorage<TaskFilter>('study-planner:filter', 'all', isTaskFilter)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  // server state: лише тут, без копій у Context чи localStorage
  const { status, tasks, total, error, reload, createTask, updateTask, toggleTask, deleteTask } =
    useTaskList(page, PAGE_SIZE)
  const { toast } = useToast()

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    document.title = `Study Planner — ${total} tasks`
  }, [total])

  // похідні дані обчислюються під час рендеру
  const counts = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length
    return { all: tasks.length, completed, active: tasks.length - completed }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    return tasks.filter((task) => {
      if (filter === 'completed' && !task.completed) return false
      if (filter === 'active' && task.completed) return false
      return task.title.toLowerCase().includes(query)
    })
  }, [tasks, filter, debouncedSearch])

  const handleCreate = useCallback(
    async (newTask: NewTask) => {
      const task = await createTask(newTask)
      // нове завдання показується на першій сторінці
      setPage(1)
      toast.success(`Завдання «${task.title}» створено`)
    },
    [createTask, toast],
  )

  const handleUpdate = useCallback(
    async (id: number, changes: NewTask) => {
      await updateTask(id, changes)
      toast.success('Зміни збережено')
    },
    [updateTask, toast],
  )

  const handleToggle = useCallback(
    async (task: Task) => {
      try {
        await toggleTask(task)
      } catch (toggleError) {
        toast.error(`Не вдалося змінити статус: ${getErrorMessage(toggleError)}`)
      }
    },
    [toggleTask, toast],
  )

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await deleteTask(id)
        toast.success('Завдання видалено')
        // якщо видалили останнє завдання на сторінці — переходимо на попередню
        if (tasks.length === 1 && page > 1) setPage(page - 1)
      } catch (deleteError) {
        toast.error(`Не вдалося видалити: ${getErrorMessage(deleteError)}`)
      }
    },
    [deleteTask, toast, tasks.length, page],
  )

  const closeDetails = useCallback(() => setSelectedTaskId(null), [])

  const hasData = tasks.length > 0
  const isLoading = status === 'loading'

  function renderList() {
    // перше завантаження або завантаження після помилки — окремий loading state
    if (isLoading && !hasData) return <StatusMessage variant="loading">Loading...</StatusMessage>
    if (status === 'error') {
      return (
        <StatusMessage variant="error" onRetry={reload}>
          Помилка завантаження. {error}
        </StatusMessage>
      )
    }
    if (!hasData) return <StatusMessage variant="empty">Завдань не знайдено.</StatusMessage>
    if (visibleTasks.length === 0) {
      return <StatusMessage variant="empty">За цим фільтром або пошуком на сторінці завдань немає.</StatusMessage>
    }
    return (
      <TaskList
        tasks={visibleTasks}
        isStale={isLoading}
        onToggle={handleToggle}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onOpenDetails={setSelectedTaskId}
      />
    )
  }

  return (
    <main className="study-planner">
      <aside className="study-planner__sidebar">
        <TaskForm onSubmit={handleCreate} />
      </aside>

      <div className="study-planner__content">
        <TaskStats total={total} pageCounts={counts} />
        <TaskFilters value={filter} onChange={setFilter} counts={counts} />
        <TaskSearch value={search} onChange={setSearch} isPending={search !== debouncedSearch} />
        {isLoading && hasData && (
          <StatusMessage variant="loading" compact>
            Loading...
          </StatusMessage>
        )}
        {renderList()}
        {/* кнопки не блокуються під час loading: новий клік скасовує попередній GET */}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {selectedTaskId !== null && (
        // key: для кожного завдання — новий екземпляр зі своїм станом запиту
        <TaskDetails key={selectedTaskId} taskId={selectedTaskId} onClose={closeDetails} />
      )}
    </main>
  )
}

export default StudyPlannerPage
