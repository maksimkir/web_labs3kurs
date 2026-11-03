import { useState } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import { initialTasks } from './data/initialTasks'
import type { NewTask, Task } from './types/task'
import './App.scss'

function App() {
  // список завдань живе в стані App і передається дочірнім компонентам через props
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

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

  return (
    <div className="app">
      <Header />
      <main className="app__container">
        <aside className="app__sidebar">
          <TaskForm onAdd={addTask} />
        </aside>
        <div className="app__content">
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </div>
      </main>
    </div>
  )
}

export default App
