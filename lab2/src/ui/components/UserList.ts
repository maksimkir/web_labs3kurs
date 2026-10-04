import { IUser } from '../../models/interfaces/IUser';

export interface UserListComponent {
  element: HTMLElement;
  update: (users: IUser[]) => void;
}

export function createUserList(onDelete: (user: IUser) => void): UserListComponent {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-3';

  const heading = document.createElement('h5');
  heading.textContent = 'Список Користувачів';
  wrapper.appendChild(heading);

  const listContainer = document.createElement('div');
  wrapper.appendChild(listContainer);

  function render(users: IUser[]): void {
    listContainer.innerHTML = '';
    if (users.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'text-muted';
      empty.textContent = 'Користувачів ще немає.';
      listContainer.appendChild(empty);
      return;
    }
    users.forEach((user) => {
      const row = document.createElement('div');
      row.className = 'd-flex justify-content-between align-items-center py-2 border-bottom';

      const label = document.createElement('span');
      label.textContent = user.id + ' ' + user.name + ' (' + user.email + ')';
      row.appendChild(label);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-outline-danger btn-sm';
      deleteBtn.textContent = 'Видалити';
      deleteBtn.addEventListener('click', () => onDelete(user));
      row.appendChild(deleteBtn);

      listContainer.appendChild(row);
    });
  }

  return { element: wrapper, update: render };
}
