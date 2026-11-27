import { useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { session } from '../auth/session'
import { AuthContext, type AuthContextValue } from './auth-context'

/**
 * Auth Context — React-обгортка над модулем session.
 * useSyncExternalStore перерендерює споживачів після login/logout/refresh.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(session.subscribe, session.get)

  const value = useMemo<AuthContextValue>(
    () => ({
      user: current?.user ?? null,
      accessToken: current?.tokens.accessToken ?? null,
      isAuthenticated: current !== null,
      isAdmin: current?.user.role === 'admin',
      login: session.login,
      logout: session.logout,
    }),
    [current],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
