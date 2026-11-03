import { useState } from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import TaskToolbar from './components/TaskToolbar'
import { initialTasks } from './data/initialTasks'
import { PRIORITY_ORDER, type NewTask, type Task, type TaskFilter } from './types/task'
import type { Theme } from './types/theme'
import './App.scss'

function preferredTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  // список завдань живе в стані App і передається дочірнім компонентам через props
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
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

  function addTask(newTask: NewTask) {
    // незмінне оновлення: новий масив з новим завданням на початку
    setTasks((prev) => {
      const nextId = Math.max(0, ...prev.map((task) => task.id)) + 1
      return [{ ...newTask, id: nextId, completed: false }, ...prev]
    })
  }

  function toggleTask(id: number) {
    // map повертає новий масив; змінене завдання — новий об'єкт, інші — без змін
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    )
  }

  function deleteTask(id: number) {
    // filter повертає новий масив без видаленого завдання
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed))
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
