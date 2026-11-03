import { useState } from 'react'
import Header from './components/Header'
import TaskList from './components/TaskList'
import { initialTasks } from './data/initialTasks'
import type { Task } from './types/task'
import './App.scss'

function App() {
  // список завдань живе в стані App і передається дочірнім компонентам через props
  const [tasks] = useState<Task[]>(initialTasks)

  return (
    <div className="app">
      <Header />
      <main className="app__container">
        <div className="app__content">
          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  )
}

export default App
