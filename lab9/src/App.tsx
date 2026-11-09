import { useEffect } from 'react'
import Header from './components/Header'
import TaskFilters from './components/TaskFilters'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import TaskStats from './components/TaskStats'
import TaskToolbar from './components/TaskToolbar'
import ToastContainer from './components/ToastContainer'
import { useTaskContext } from './hooks/useTaskContext'
import { useTheme } from './hooks/useTheme'
import './App.scss'

function App() {
  const { addTask, counts } = useTaskContext()
  const { theme } = useTheme()
  const activeCount = counts.active

  // синхронізація React state із зовнішнім API браузера — заголовком вкладки
  useEffect(() => {
    document.title = `Study Planner — ${activeCount} active ${activeCount === 1 ? 'task' : 'tasks'}`
  }, [activeCount])

  return (
    <div className={`app${theme === 'dark' ? ' app--dark' : ''}`}>
      <Header />
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
