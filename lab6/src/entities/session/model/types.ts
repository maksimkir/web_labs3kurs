export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

/** Дані поточного користувача, які повертають POST /auth/login і GET /auth/me. */
export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  image?: string
}

export type LoginResponse = AuthUser & AuthTokens
