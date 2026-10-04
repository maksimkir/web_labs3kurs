import { Modal } from '../ui/components/Modal';

/**
 * Сервіс сповіщень користувача. Використання window.alert() заборонено
 * умовою завдання, тому всі повідомлення реалізовані через модальні вікна.
 */
export class NotificationService {
  public static info(message: string, title = 'Повідомлення'): void {
    const modal = new Modal({
      title,
      bodyText: message,
      confirmText: 'Зрозуміло!',
    });
    modal.open();
  }

  public static confirm(message: string, onConfirm: () => void, title = 'Підтвердження'): void {
    const modal = new Modal({
      title,
      bodyText: message,
      confirmText: 'Так',
      cancelText: 'Скасувати',
      onConfirm,
    });
    modal.open();
  }

  public static prompt(
    message: string,
    onConfirm: (value?: string) => void,
    title = 'Введіть дані',
    placeholder = '',
  ): void {
    const modal = new Modal({
      title,
      bodyText: message,
      withInput: true,
      inputPlaceholder: placeholder,
      confirmText: 'Зберегти',
      cancelText: 'Скасувати',
      onConfirm,
    });
    modal.open();
  }
}
