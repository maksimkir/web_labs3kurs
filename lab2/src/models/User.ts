import { IUser } from './interfaces/IUser';

/**
 * Клас користувача бібліотеки.
 */
export class User implements IUser {
  public borrowedBooksCount: number;

  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
  ) {
    this.borrowedBooksCount = 0;
  }

  public getInfo(): string {
    return `${this.id} ${this.name} (${this.email})`;
  }

  /** Чи може користувач позичити ще одну книгу з урахуванням ліміту */
  public canBorrow(maxBooks: number): boolean {
    return this.borrowedBooksCount < maxBooks;
  }

  public incrementBorrowed(): void {
    this.borrowedBooksCount += 1;
  }

  public decrementBorrowed(): void {
    if (this.borrowedBooksCount > 0) {
      this.borrowedBooksCount -= 1;
    }
  }

  public static fromPlainObject(obj: IUser): User {
    const user = new User(obj.id, obj.name, obj.email);
    user.borrowedBooksCount = obj.borrowedBooksCount;
    return user;
  }
}
