export interface IUser {
  id: string;
  name: string;
  email: string;
  borrowedBooksCount: number;
  getInfo(): string;
  canBorrow(maxBooks: number): boolean;
}
