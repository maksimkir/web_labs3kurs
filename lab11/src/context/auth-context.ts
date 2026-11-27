import { createContext } from 'react'
import type { LoginCredentials, User } from '../types/auth'

export interface AuthContextValue {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (credentials: LoginCredentials) => Promise<User>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
