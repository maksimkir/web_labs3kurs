import { useTheme } from '../hooks/useTheme'
import './Header.scss'

function Header() {
  const { theme, toggleTheme: onToggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className="header">
      <div className="header__container">
        <div>
          <h1 className="header__title">Study Planner</h1>
          <p className="header__subtitle">Планувальник навчальних завдань</p>
        </div>
        <button
          type="button"
          className="header__theme-toggle"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
        >
          {isDark ? '☀ Світла' : '☾ Темна'}
        </button>
      </div>
    </header>
  )
}

export default Header
