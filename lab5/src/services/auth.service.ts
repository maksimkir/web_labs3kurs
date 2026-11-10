import { http } from '@/api/http-client'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '@/types/auth'

const TOKEN_TTL_MINUTES = Number(import.meta.env.VITE_TOKEN_TTL_MINUTES) || 30

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse>
  me(): Promise<AuthUser>
  refresh(refreshToken: string): Promise<AuthTokens>
}

export class AuthService implements AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: TOKEN_TTL_MINUTES }),
    })
  }

  // захищений ендпоінт: http-клієнт додає Authorization: Bearer <accessToken>
  me(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: TOKEN_TTL_MINUTES }),
    })
  }
}
