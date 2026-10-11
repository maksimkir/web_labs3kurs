import { IBook } from './interfaces/IBook';


export class Book implements IBook {
  public isBorrowed: boolean;
  public borrowedBy: string | null;

  constructor(
    public readonly id: string,
    public title: string,
    public author: string,
    public year: number,
  ) {
    this.isBorrowed = false;
    this.borrowedBy = null;
  }

  /** Коротка інформація про книгу для відображення в UI */
  public getInfo(): string {
    return `${this.title} by ${this.author} (${this.year})`;
  }

  /** Позначити книгу як позичену конкретним користувачем */
  public borrow(userId: string): void {
    this.isBorrowed = true;
    this.borrowedBy = userId;
  }

  /** Позначити книгу як повернуту */
  public returnBook(): void {
    this.isBorrowed = false;
    this.borrowedBy = null;
  }

  /** Відновлення екземпляра Book з простого об'єкта (напр., після зчитування з LocalStorage) */
  public static fromPlainObject(obj: IBook): Book {
    const book = new Book(obj.id, obj.title, obj.author, obj.year);
    book.isBorrowed = obj.isBorrowed;
    book.borrowedBy = obj.borrowedBy;
    return book;
  }
}
