import { Storage } from './Storage';

/** Мінімальна вимога до типу, яким оперує Library<T> */
export interface Identifiable {
  id: string;
}

/**
 * Generic-клас Library<T> для управління колекцією об'єктів будь-якого типу,
 * що має унікальний ідентифікатор (id). Використовується як для книг, так і
 * для користувачів - без дублювання логіки CRUD.
 */
export class Library<T extends Identifiable> {
  private items: T[];

  constructor(
    private readonly storage: Storage<T>,
    private readonly deserialize?: (plain: T) => T,
  ) {
    const loaded = storage.load();
    this.items = this.deserialize ? loaded.map(this.deserialize) : loaded;
  }

  /** Повернути всі елементи колекції */
  public getAll(): T[] {
    return [...this.items];
  }

  /** Додати новий елемент до колекції та зберегти в LocalStorage */
  public add(item: T): void {
    this.items.push(item);
    this.persist();
  }

  /** Видалити елемент за id. Повертає true, якщо видалення відбулось */
  public remove(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    const removed = this.items.length !== initialLength;
    if (removed) {
      this.persist();
    }
    return removed;
  }

  /** Знайти елемент за id */
  public findById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  /** Знайти елементи за довільним предикатом (напр. пошук за автором/назвою) */
  public find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  /** Кількість елементів у колекції */
  public count(): number {
    return this.items.length;
  }

  /** Зберегти поточний стан колекції в LocalStorage (викликати після мутації елемента) */
  public persist(): void {
    this.storage.save(this.items);
  }
}
