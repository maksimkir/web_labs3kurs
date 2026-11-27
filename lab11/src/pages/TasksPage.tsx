import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '../api/errors'
import Pagination from '../components/Pagination'
import StatusMessage from '../components/StatusMessage'
import TaskFilters from '../components/TaskFilters'
import TaskFormDialog from '../components/TaskFormDialog'
import TaskList from '../components/TaskList'
import TaskStats from '../components/TaskStats'
import TaskToolbar from '../components/TaskToolbar'
import { useAuth } from '../hooks/useAuth'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useRequireAuth } from '../hooks/useRequireAuth'
import { useTaskFilters } from '../hooks/useTaskFilters'
import { useTaskList } from '../hooks/useTaskList'
import { useToast } from '../hooks/useToast'
import type { TaskFormData } from '../schemas/taskSchema'
import type { Task } from '../types/task'
import './TasksPage.scss'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 400

function TasksPage() {
  // client/UI state у URL: status, priority, page
  const { status, priority, page, setStatus, setPriority, setPage } = useTaskFilters()
  // пошук — тимчасовий локальний стан введення, у URL не потрапляє
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // server state
  const { status: loadStatus, tasks, total, error, reload, createTask, toggleTask, deleteTask } =
    useTaskList(page, PAGE_SIZE)
  const { user } = useAuth()
  const requireAuth = useRequireAuth()
  const { toast } = useToast()

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  useEffect(() => {
    document.title = `Завдання — Study Planner`
  }, [])

  const counts = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length
    return { all: tasks.length, completed, active: tasks.length - completed }
  }, [tasks])

  const visibleTasks = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase()
    return tasks.filter((task) => {
      if (status === 'completed' && !task.completed) return false
      if (status === 'active' && task.completed) return false
      if (priority && task.priority !== priority) return false
      return task.title.toLowerCase().includes(query)
    })
  }, [tasks, status, priority, debouncedSearch])

  function openCreate() {
    // захищена дія: гість іде на /login, а не бачить форму
    if (requireAuth()) setIsCreateOpen(true)
  }

  const closeCreate = useCallback(() => setIsCreateOpen(false), [])

  const handleCreate = useCallback(
    async (data: TaskFormData) => {
      if (!user) throw new Error('Потрібно увійти в систему.')
      const task = await createTask(data, { id: user.id, username: user.username })
      setIsCreateOpen(false)
      if (page !== 1) setPage(1)
      toast.success(`Завдання «${task.title}» створено`)
    },
    [createTask, user, page, setPage, toast],
  )

  const handleToggle = useCallback(
    async (task: Task) => {
      if (!requireAuth()) return
      try {
        await toggleTask(task)
      } catch (toggleError) {
        toast.error(`Не вдалося змінити статус: ${getErrorMessage(toggleError)}`)
      }
    },
    [requireAuth, toggleTask, toast],
  )

  const handleDelete = useCallback(
    async (id: number) => {
      if (!requireAuth()) return
      try {
        await deleteTask(id)
        toast.success('Завдання видалено')
        if (tasks.length === 1 && page > 1) setPage(page - 1)
      } catch (deleteError) {
        toast.error(`Не вдалося видалити: ${getErrorMessage(deleteError)}`)
      }
    },
    [requireAuth, deleteTask, toast, tasks.length, page, setPage],
  )

  const hasData = tasks.length > 0
  const isLoading = loadStatus === 'loading'

  function renderList() {
    if (isLoading && !hasData) return <StatusMessage variant="loading">Loading...</StatusMessage>
    if (loadStatus === 'error') {
      return (
        <StatusMessage variant="error" onRetry={reload}>
          Помилка завантаження. {error}
        </StatusMessage>
      )
    }
    if (!hasData) return <StatusMessage variant="empty">Завдань не знайдено.</StatusMessage>
    if (visibleTasks.length === 0) {
      return <StatusMessage variant="empty">За цими фільтрами на сторінці завдань немає.</StatusMessage>
    }
    return (
      <TaskList
        tasks={visibleTasks}
        isStale={isLoading}
        onToggle={handleToggle}
        onRequestDelete={requireAuth}
        onDelete={handleDelete}
      />
    )
  }

  return (
    <div className="tasks-page">
      <div className="tasks-page__heading">
        <h1 className="tasks-page__title">Завдання</h1>
        <button
          type="button"
          className="button button--primary tasks-page__add"
          onClick={openCreate}
          aria-label="Створити завдання"
          title="Створити завдання"
        >
          +
        </button>
      </div>

      <TaskStats total={total} pageCounts={counts} />
      <TaskFilters value={status} onChange={setStatus} counts={counts} />
      <TaskToolbar
        search={search}
        onSearchChange={setSearch}
        isSearchPending={search !== debouncedSearch}
        priority={priority}
        onPriorityChange={setPriority}
      />
      {isLoading && hasData && (
        <StatusMessage variant="loading" compact>
          Loading...
        </StatusMessage>
      )}
      {renderList()}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <TaskFormDialog open={isCreateOpen} mode="create" onClose={closeCreate} onSubmit={handleCreate} />
    </div>
  )
}

export default TasksPage
