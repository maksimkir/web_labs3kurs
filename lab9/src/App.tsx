import { useReducer, useState } from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import TaskToolbar from './components/TaskToolbar'
import { initialTasks } from './data/initialTasks'
import { taskReducer } from './reducers/taskReducer'
import { PRIORITY_ORDER, type NewTask, type TaskFilter } from './types/task'
import type { Theme } from './types/theme'
import './App.scss'

function preferredTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  // усі зміни списку завдань проходять через reducer
  const [state, dispatch] = useReducer(taskReducer, { tasks: initialTasks, pendingDelete: null })
  const { tasks } = state
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [search, setSearch] = useState('')
  const [sortByPriority, setSortByPriority] = useState(false)
  // лінива ініціалізація: тема системи визначається лише при першому рендері
  const [theme, setTheme] = useState<Theme>(preferredTheme)

  // похідні дані обчислюються при кожному рендері; вихідний масив не змінюється
  const completedCount = tasks.filter((task) => task.completed).length
  const counts: Record<TaskFilter, number> = {
    all: tasks.length,
    completed: completedCount,
    active: tasks.length - completedCount,
  }

  const query = search.trim().toLowerCase()
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed' && !task.completed) return false
    if (filter === 'active' && task.completed) return false
    return task.title.toLowerCase().includes(query)
  })
  // sort змінює масив, тому сортуємо копію
  const visibleTasks = sortByPriority
    ? [...filteredTasks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
    : filteredTasks

  function addTask(task: NewTask) {
    dispatch({ type: 'add', task })
  }

  function toggleTask(id: number) {
    dispatch({ type: 'toggle', id })
  }

  function deleteTask(id: number) {
    // тимчасово видаляємо одразу; Undoable Delete з таймером з'явиться пізніше
    dispatch({ type: 'requestDelete', id })
    dispatch({ type: 'confirmDelete' })
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function clearCompleted() {
    dispatch({ type: 'clearCompleted' })
    dispatch({ type: 'confirmDelete' })
  }

  return (
    <div className={`app${theme === 'dark' ? ' app--dark' : ''}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="app__container">
        <aside className="app__sidebar">
          <TaskForm onAdd={addTask} />
        </aside>
        <div className="app__content">
          <TaskStats tasks={tasks} />
          <TaskFilters value={filter} onChange={setFilter} counts={counts} />
          <TaskToolbar
            search={search}
            onSearchChange={setSearch}
            sortByPriority={sortByPriority}
            onSortByPriorityChange={setSortByPriority}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
          <TaskList
            tasks={visibleTasks}
            totalCount={tasks.length}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        </div>
      </main>
    </div>
  )
}

export default App
