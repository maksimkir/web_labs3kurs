import { AUTH_SERVICE_KEY, AuthService } from '@/entities/session'
import { USER_SERVICE_KEY, UserService } from '@/entities/user'
import { ServiceProvider } from '@/shared/api'

// Шар app може імпортувати будь-що, тому саме тут конкретні реалізації
// репозиторіїв реєструються в універсальному реєстрі ServiceProvider.
export function registerServices(): void {
  ServiceProvider.register(USER_SERVICE_KEY, () => new UserService())
  ServiceProvider.register(AUTH_SERVICE_KEY, () => new AuthService())
}
