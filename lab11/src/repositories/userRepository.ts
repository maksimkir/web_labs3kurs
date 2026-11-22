import { httpClient } from '../api/httpClient'
import type { User, UsersResponse } from '../types/auth'
import { toUser } from './authRepository'

/** Користувачі для адміністративної сторінки (додаткове завдання). */
export const userRepository = {
  async getUsers(limit: number, signal?: AbortSignal): Promise<{ users: User[]; total: number }> {
    const response = await httpClient.get<UsersResponse>('users', {
      query: { limit, select: 'username,email,firstName,lastName,image,role' },
      auth: true,
      signal,
    })
    return { users: response.users.map(toUser), total: response.total }
  },
}
