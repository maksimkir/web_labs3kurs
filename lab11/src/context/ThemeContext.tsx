import { useCallback, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Theme } from '../types/theme'
import { ThemeContext } from './theme-context'

function preferredTheme(): Theme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/** Окремий контекст теми: тема не пов'язана із завданнями й зберігається між сесіями. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('study-planner:theme', preferredTheme(), isTheme)

  const toggleTheme = useCallback(
    () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    [setTheme],
  )

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
