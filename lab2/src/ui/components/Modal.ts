/**
 * Компонент модального вікна. Не використовує жодної декларативної розмітки -
 * весь DOM створюється програмно через document.createElement.
 */
export interface ModalOptions {
  title?: string;
  bodyText?: string;
  bodyElement?: HTMLElement;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (inputValue?: string) => void;
  onCancel?: () => void;
  withInput?: boolean;
  inputPlaceholder?: string;
}

export class Modal {
  private overlay: HTMLDivElement;
  private inputEl: HTMLInputElement | null = null;

  constructor(private readonly options: ModalOptions) {
    this.overlay = this.build();
  }

  private build(): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const box = document.createElement('div');
    box.className = 'modal-box';

    const header = document.createElement('div');
    header.className = 'modal-header';

    const title = document.createElement('h3');
    title.textContent = this.options.title ?? '';
    header.appendChild(title);

    if (this.options.cancelText !== undefined || this.options.onCancel) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close';
      closeBtn.setAttribute('aria-label', 'close');
      closeBtn.textContent = '\u00D7';
      closeBtn.addEventListener('click', () => this.close(this.options.onCancel));
      header.appendChild(closeBtn);
    }

    const body = document.createElement('div');
    body.className = 'modal-body';
    if (this.options.bodyElement) {
      body.appendChild(this.options.bodyElement);
    } else if (this.options.bodyText) {
      const p = document.createElement('p');
      p.textContent = this.options.bodyText;
      body.appendChild(p);
    }

    if (this.options.withInput) {
      this.inputEl = document.createElement('input');
      this.inputEl.type = 'text';
      this.inputEl.className = 'form-control';
      this.inputEl.placeholder = this.options.inputPlaceholder ?? '';
      body.appendChild(this.inputEl);
    }

    const footer = document.createElement('div');
    footer.className = 'modal-footer';

    if (this.options.cancelText) {
      const cancelBtn = document.createElement('button');
      cancelBtn.className = 'btn btn-secondary';
      cancelBtn.textContent = this.options.cancelText;
      cancelBtn.addEventListener('click', () => this.close(this.options.onCancel));
      footer.appendChild(cancelBtn);
    }

    if (this.options.confirmText) {
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn btn-primary';
      confirmBtn.textContent = this.options.confirmText;
      confirmBtn.addEventListener('click', () => {
        const value = this.inputEl?.value;
        this.close(() => this.options.onConfirm?.(value));
      });
      footer.appendChild(confirmBtn);
    }

    box.appendChild(header);
    box.appendChild(body);
    box.appendChild(footer);
    overlay.appendChild(box);
    return overlay;
  }

  public open(): void {
    document.body.appendChild(this.overlay);
    this.inputEl?.focus();
  }

  private close(callback?: () => void): void {
    this.overlay.remove();
    callback?.();
  }
}
