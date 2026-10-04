import { Book } from '../models/Book';
import { User } from '../models/User';
import { IBook } from '../models/interfaces/IBook';
import { IUser } from '../models/interfaces/IUser';
import { Library } from '../services/Library';
import { Storage } from '../services/Storage';
import { NotificationService } from '../services/NotificationService';
import { generateId } from '../utils/idGenerator';
import { Validation } from '../utils/validators';
import { APP_CONFIG } from '../types';
import { createBookForm } from './components/BookForm';
import { createUserForm } from './components/UserForm';
import { createBookList } from './components/BookList';
import { createUserList } from './components/UserList';

/**
 * Точка збирання UI. Ініціалізує сховища/бібліотеки книг та користувачів
 * і монтує весь інтерфейс у контейнер #app, повністю програмно (без розмітки в HTML).
 */
export function renderApp(root: HTMLElement): void {
  const bookLibrary = new Library<IBook>(new Storage<IBook>('books'), Book.fromPlainObject);
  const userLibrary = new Library<IUser>(new Storage<IUser>('users'), User.fromPlainObject);

  root.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'app-container';

  const title = document.createElement('h1');
  title.className = 'app-title';
  title.textContent = 'Система Управління Бібліотекою';
  container.appendChild(title);

  const bookForm = createBookForm((data) => {
    const book = new Book(generateId(), data.title, data.author, data.year);
    bookLibrary.add(book);
    bookList.update(bookLibrary.getAll());
  });
  container.appendChild(bookForm);

  const userForm = createUserForm((data) => {
    const user = new User(generateId(), data.name, data.email);
    userLibrary.add(user);
    userList.update(userLibrary.getAll());
  });
  container.appendChild(userForm);

  const bookList = createBookList({
    onBorrow: (book) => handleBorrow(book),
    onReturn: (book) => handleReturn(book),
    onDelete: (book) => {
      bookLibrary.remove(book.id);
      bookList.update(bookLibrary.getAll());
    },
  });
  container.appendChild(bookList.element);

  const userList = createUserList((user) => {
    userLibrary.remove(user.id);
    userList.update(userLibrary.getAll());
  });
  container.appendChild(userList.element);

  root.appendChild(container);

  bookList.update(bookLibrary.getAll());
  userList.update(userLibrary.getAll());

  function handleBorrow(book: IBook): void {
    NotificationService.prompt(
      'Введіть ID користувача для позичення книги:',
      (value) => {
        if (!value) return;
        const idResult = Validation.isNumericId(value.trim());
        if (!idResult.valid) {
          NotificationService.info(idResult.message ?? 'Некоректний ID', 'Помилка');
          return;
        }

        const user = userLibrary.findById(value.trim());
        if (!user) {
          NotificationService.info('Користувача з таким ID не знайдено.', 'Помилка');
          return;
        }

        if (!user.canBorrow(APP_CONFIG.maxBooksPerUser)) {
          NotificationService.info(
            `Користувач вже позичив максимальну кількість книг (${APP_CONFIG.maxBooksPerUser}).`,
            'Перевищено ліміт',
          );
          return;
        }

        book.isBorrowed = true;
        book.borrowedBy = user.id;
        bookLibrary.persist();

        user.borrowedBooksCount += 1;
        userLibrary.persist();

        bookList.update(bookLibrary.getAll());
        userList.update(userLibrary.getAll());

        NotificationService.info(
          `${book.title} by ${book.author} (${book.year}) has been borrowed by ${user.getInfo()}.`,
        );
      },
      'Введіть ID користувача для позичення книги:',
      'ID',
    );
  }

  function handleReturn(book: IBook): void {
    const user = book.borrowedBy ? userLibrary.findById(book.borrowedBy) : undefined;

    book.isBorrowed = false;
    book.borrowedBy = null;
    bookLibrary.persist();

    if (user) {
      user.borrowedBooksCount = Math.max(0, user.borrowedBooksCount - 1);
      userLibrary.persist();
    }

    bookList.update(bookLibrary.getAll());
    userList.update(userLibrary.getAll());

    NotificationService.info(`${book.title} by ${book.author} (${book.year}) has been returned.`);
  }
}
