/** Поточний користувач (domain-модель для UI). */
export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
  role: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  username: string
  password: string
}

/** DTO DummyJSON: GET /auth/me та /users. */
export interface ApiUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
  role?: string
}

/** DTO DummyJSON: POST /auth/login. */
export interface ApiLoginResponse extends ApiUser {
  accessToken: string
  refreshToken: string
}

/** DTO DummyJSON: POST /auth/refresh. */
export interface ApiRefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface UsersResponse {
  users: ApiUser[]
  total: number
  skip: number
  limit: number
}
