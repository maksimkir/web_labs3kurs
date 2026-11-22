import { httpClient } from '../api/httpClient'
import type {
  ApiLoginResponse,
  ApiRefreshResponse,
  ApiUser,
  AuthTokens,
  LoginCredentials,
  User,
} from '../types/auth'

/** Тривалість accessToken у DummyJSON (хвилини). */
const TOKEN_LIFETIME_MINUTES = 30

export function toUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    email: apiUser.email,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    image: apiUser.image,
    role: apiUser.role ?? 'user',
  }
}

/** Repository автентифікації: приховує endpoint-и /auth/* і формат DTO. */
export const authRepository = {
  /** POST /auth/login → accessToken і refreshToken. */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await httpClient.post<ApiLoginResponse>('auth/login', {
      ...credentials,
      expiresInMins: TOKEN_LIFETIME_MINUTES,
    })
    return { accessToken: response.accessToken, refreshToken: response.refreshToken }
  },

  /** GET /auth/me з Authorization: Bearer <token> → поточний користувач (з роллю). */
  async me(signal?: AbortSignal): Promise<User> {
    const apiUser = await httpClient.get<ApiUser>('auth/me', { auth: true, signal })
    return toUser(apiUser)
  },

  /** POST /auth/refresh → нова пара токенів. */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    const response = await httpClient.post<ApiRefreshResponse>('auth/refresh', {
      refreshToken,
      expiresInMins: TOKEN_LIFETIME_MINUTES,
    })
    return { accessToken: response.accessToken, refreshToken: response.refreshToken }
  },
}
