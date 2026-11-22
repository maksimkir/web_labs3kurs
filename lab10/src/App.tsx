import Header from './components/Header'
import ToastContainer from './components/ToastContainer'
import { useTheme } from './hooks/useTheme'
import StudyPlannerPage from './pages/StudyPlannerPage'
import './App.scss'

function App() {
  const { theme } = useTheme()

  return (
    <div className={`app${theme === 'dark' ? ' app--dark' : ''}`}>
      <Header />
      <StudyPlannerPage />
      <ToastContainer />
    </div>
  )
}

export default App
