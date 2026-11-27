import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../hooks/useToast'
import './Header.scss'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `header__link${isActive ? ' header__link--active' : ''}`
}

function Header() {
  const { theme, toggleTheme } = useTheme()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  function handleLogout() {
    logout()
    toast.info('Ви вийшли з акаунта')
    navigate('/tasks')
  }

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/tasks" className="header__brand">
          <span className="header__title">Study Planner</span>
          <span className="header__subtitle">Планувальник навчальних завдань</span>
        </Link>

        {/* NavLink — перехід без перезавантаження сторінки + активний стан посилання */}
        <nav className="header__nav" aria-label="Основна навігація">
          <NavLink to="/tasks" className={navLinkClass}>
            Завдання
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            Профіль
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              Адмін
            </NavLink>
          )}
        </nav>

        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <span className="header__user">{user?.username}</span>
              <button type="button" className="header__button" onClick={handleLogout}>
                Вийти
              </button>
            </>
          ) : (
            <NavLink to="/login" className="header__button">
              Увійти
            </NavLink>
          )}
          <button
            type="button"
            className="header__button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
          >
            {isDark ? '☀' : '☾'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
