import type { User } from './user'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** Дані користувача, які повертає POST /auth/login. */
export type AuthUser = Pick<User, 'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'gender' | 'image'>

export type LoginResponse = AuthUser & AuthTokens
