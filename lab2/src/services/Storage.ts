/**
 * Generic-сервіс для роботи з LocalStorage.
 * T - тип елементів, що зберігаються у вигляді масиву під одним ключем.
 */
export class Storage<T> {
  constructor(private readonly key: string) {}

  /** Зберегти масив елементів у LocalStorage */
  public save(data: T[]): void {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.error(`Storage: не вдалось зберегти дані за ключем "${this.key}"`, error);
    }
  }

  /** Завантажити масив елементів з LocalStorage */
  public load(): T[] {
    try {
      const raw = window.localStorage.getItem(this.key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch (error) {
      console.error(`Storage: не вдалось прочитати дані за ключем "${this.key}"`, error);
      return [];
    }
  }

  /** Видалити дані за ключем цього сховища */
  public remove(): void {
    window.localStorage.removeItem(this.key);
  }

  /** Повністю очистити весь LocalStorage (усі ключі застосунку) */
  public static clearAll(): void {
    window.localStorage.clear();
  }
}
