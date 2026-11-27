import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { loginPath } from '../auth/redirect'
import { useAuth } from './useAuth'
import { useToast } from './useToast'

/**
 * Authorization для CRUD-дій: перед захищеною дією перевіряємо сесію.
 * Гість переходить на /login, а після входу повертається туди, де був.
 * Повертає true, якщо дію можна виконувати.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  return useCallback((): boolean => {
    if (isAuthenticated) return true
    toast.info('Увійдіть, щоб створювати, редагувати або видаляти завдання')
    navigate(loginPath(location.pathname + location.search))
    return false
  }, [isAuthenticated, navigate, location.pathname, location.search, toast])
}
