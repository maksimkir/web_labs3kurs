import { AuthService, type AuthRepository } from './auth.service'
import { UserService, type UserRepository } from './user.service'

// Єдина точка отримання сервісів: клієнтський код не створює їх через new
// і залежить лише від інтерфейсів, тому реалізацію легко підмінити фейком.
export class ServiceProvider {
  private static userService?: UserRepository
  private static authService?: AuthRepository

  static get users(): UserRepository {
    this.userService ??= new UserService()
    return this.userService
  }

  static get auth(): AuthRepository {
    this.authService ??= new AuthService()
    return this.authService
  }

  /** Підміна реалізацій (наприклад, фейками в тестах). */
  static override(services: { users?: UserRepository; auth?: AuthRepository }): void {
    if (services.users) this.userService = services.users
    if (services.auth) this.authService = services.auth
  }
}
