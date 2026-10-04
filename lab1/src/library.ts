// Завдання 9.
// Інтерфейс LibraryItem, класи Book, Magazine, DVD, клас Library.

interface LibraryItem {
  title: string;
  author: string;
  isBorrowed: boolean;
  borrow(): void;
}

class Book implements LibraryItem {
  title: string;
  author: string;
  isBorrowed: boolean = false;
  pagesCount: number;

  constructor(title: string, author: string, pagesCount: number) {
    this.title = title;
    this.author = author;
    this.pagesCount = pagesCount;
  }

  borrow(): void {
    this.isBorrowed = true;
    console.log(`Книгу "${this.title}" позичено.`);
  }
}

class Magazine implements LibraryItem {
  title: string;
  author: string;
  isBorrowed: boolean = false;
  issueNumber: number;

  constructor(title: string, author: string, issueNumber: number) {
    this.title = title;
    this.author = author;
    this.issueNumber = issueNumber;
  }

  borrow(): void {
    this.isBorrowed = true;
    console.log(`Журнал "${this.title}" (випуск №${this.issueNumber}) позичено.`);
  }
}

class DVD implements LibraryItem {
  title: string;
  author: string;
  isBorrowed: boolean = false;
  durationMinutes: number;

  constructor(title: string, author: string, durationMinutes: number) {
    this.title = title;
    this.author = author;
    this.durationMinutes = durationMinutes;
  }

  borrow(): void {
    this.isBorrowed = true;
    console.log(`DVD "${this.title}" (тривалість: ${this.durationMinutes} хв) позичено.`);
  }
}

class Library {
  private items: LibraryItem[] = [];

  addItem(item: LibraryItem): void {
    this.items.push(item);
  }

  findItemByName(name: string): LibraryItem | undefined {
    return this.items.find((item) => item.title === name);
  }

  printAvailableItems(): void {
    const available = this.items.filter((item) => !item.isBorrowed);
    console.log("Доступні елементи бібліотеки:");
    for (const item of available) {
      console.log(`- "${item.title}" (автор: ${item.author})`);
    }
  }
}

const library = new Library();

const book = new Book("Кобзар", "Тарас Шевченко", 300);
const magazine = new Magazine("National Geographic", "Редакція NG", 154);
const dvd = new DVD("Тіні забутих предків", "Сергій Параджанов", 97);

library.addItem(book);
library.addItem(magazine);
library.addItem(dvd);

library.printAvailableItems();

const found = library.findItemByName("Кобзар");
found?.borrow();

console.log("\nПісля позичання книги:");
library.printAvailableItems();

export {};
