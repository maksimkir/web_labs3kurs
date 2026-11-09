import { useEffect, useState } from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import TaskToolbar from './components/TaskToolbar'
import ToastContainer from './components/ToastContainer'
import { useTaskContext } from './hooks/useTaskContext'
import type { Theme } from './types/theme'
import './App.scss'

function preferredTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function App() {
  const { addTask, counts } = useTaskContext()
  const activeCount = counts.active

  // синхронізація React state із зовнішнім API браузера — заголовком вкладки
  useEffect(() => {
    document.title = `Study Planner — ${activeCount} active ${activeCount === 1 ? 'task' : 'tasks'}`
  }, [activeCount])
  // лінива ініціалізація: тема системи визначається лише при першому рендері
  const [theme, setTheme] = useState<Theme>(preferredTheme)

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className={`app${theme === 'dark' ? ' app--dark' : ''}`}>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="app__container">
        <aside className="app__sidebar">
          <TaskForm onSubmit={addTask} />
        </aside>
        <div className="app__content">
          <TaskStats />
          <TaskFilters />
          <TaskToolbar />
          <TaskList />
        </div>
      </main>
      <ToastContainer />
    </div>
  )
}

export default App
