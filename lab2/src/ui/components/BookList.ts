import { IBook } from '../../models/interfaces/IBook';
import { APP_CONFIG } from '../../types';

export interface BookListHandlers {
  onBorrow: (book: IBook) => void;
  onReturn: (book: IBook) => void;
  onDelete: (book: IBook) => void;
}

export interface BookListComponent {
  element: HTMLElement;
  /** Перемалювати список на основі нового масиву книг (напр. після додавання/пошуку) */
  update: (books: IBook[]) => void;
}

/**
 * Компонент списку книг з пошуком за назвою/автором та пагінацією
 * (5 елементів на сторінку, якщо загальна кількість книг > 40).
 */
export function createBookList(handlers: BookListHandlers): BookListComponent {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-3';

  const heading = document.createElement('h5');
  heading.textContent = 'Список Книг';
  wrapper.appendChild(heading);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control mb-3';
  searchInput.placeholder = 'Пошук за назвою або автором...';
  wrapper.appendChild(searchInput);

  const listContainer = document.createElement('div');
  wrapper.appendChild(listContainer);

  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'd-flex gap-2 justify-content-center mt-2';
  wrapper.appendChild(paginationContainer);

  let allBooks: IBook[] = [];
  let currentPage = 1;

  function getFiltered(): IBook[] {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return allBooks;
    return allBooks.filter(
      (b) => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query),
    );
  }

  function renderPage(): void {
    const filtered = getFiltered();
    const usePagination = allBooks.length > APP_CONFIG.paginationThreshold;
    const pageSize = usePagination ? APP_CONFIG.pageSize : filtered.length || 1;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);

    const start = usePagination ? (currentPage - 1) * pageSize : 0;
    const pageItems = usePagination ? filtered.slice(start, start + pageSize) : filtered;

    listContainer.innerHTML = '';
    if (pageItems.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'text-muted';
      empty.textContent = 'Книг не знайдено.';
      listContainer.appendChild(empty);
    }

    pageItems.forEach((book) => {
      const row = document.createElement('div');
      row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';

      const label = document.createElement('span');
      label.textContent = book.title + ' by ' + book.author + ' (' + book.year + ')';
      row.appendChild(label);

      const actions = document.createElement('div');
      actions.className = 'd-flex gap-2';

      const actionBtn = document.createElement('button');
      if (book.isBorrowed) {
        actionBtn.className = 'btn btn-warning btn-sm';
        actionBtn.textContent = 'Повернути';
        actionBtn.addEventListener('click', () => handlers.onReturn(book));
      } else {
        actionBtn.className = 'btn btn-primary btn-sm';
        actionBtn.textContent = 'Позичити';
        actionBtn.addEventListener('click', () => handlers.onBorrow(book));
      }
      actions.appendChild(actionBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.addEventListener('click', () => handlers.onDelete(book));
      actions.appendChild(deleteBtn);

      row.appendChild(actions);
      listContainer.appendChild(row);
    });

    paginationContainer.innerHTML = '';
    if (usePagination && totalPages > 1) {
      for (let p = 1; p <= totalPages; p += 1) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'btn btn-sm ' + (p === currentPage ? 'btn-dark' : 'btn-outline-dark');
        pageBtn.textContent = String(p);
        pageBtn.addEventListener('click', () => {
          currentPage = p;
          renderPage();
        });
        paginationContainer.appendChild(pageBtn);
      }
    }
  }

  searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderPage();
  });

  return {
    element: wrapper,
    update: (books: IBook[]) => {
      allBooks = books;
      renderPage();
    },
  };
}
