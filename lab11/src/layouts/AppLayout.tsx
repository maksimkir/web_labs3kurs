import { Outlet, useNavigation } from 'react-router'
import Header from '../components/Header'
import ToastContainer from '../components/ToastContainer'
import { useTheme } from '../hooks/useTheme'
import './AppLayout.scss'

/** Спільний layout: Header + навігація + область контенту (<Outlet /> для дочірніх маршрутів). */
function AppLayout() {
  const { theme } = useTheme()
  // поки працюють loader-и наступного маршруту — тонка смуга прогресу
  const isNavigating = useNavigation().state === 'loading'

  return (
    <div className={`app-layout${theme === 'dark' ? ' app-layout--dark' : ''}`}>
      {isNavigating && <div className="app-layout__progress" role="progressbar" aria-label="Завантаження сторінки" />}
      <Header />
      <main className="app-layout__main">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  )
}

export default AppLayout
