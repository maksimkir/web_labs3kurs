import { Validation } from '../../utils/validators';

export interface NewBookData {
  title: string;
  author: string;
  year: number;
}

/** Створює форму додавання книги. onSubmit викликається лише якщо валідація пройшла успішно. */
export function createBookForm(onSubmit: (data: NewBookData) => void): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-3';

  const heading = document.createElement('h5');
  heading.textContent = 'Додати Книгу';
  wrapper.appendChild(heading);

  const form = document.createElement('form');
  form.noValidate = true;

  const titleGroup = buildField('title', 'Назва книги', 'text');
  const authorGroup = buildField('author', 'Автор', 'text');
  const yearGroup = buildField('year', 'Рік видання', 'text');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-success mt-2';
  submitBtn.textContent = 'Додати Книгу';

  form.appendChild(titleGroup.group);
  form.appendChild(authorGroup.group);
  form.appendChild(yearGroup.group);
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleResult = Validation.required(titleGroup.input.value);
    const authorResult = Validation.required(authorGroup.input.value);
    const yearResult = Validation.isYear(yearGroup.input.value);

    setFieldError(titleGroup, titleResult.message);
    setFieldError(authorGroup, authorResult.message);
    setFieldError(yearGroup, yearResult.message);

    if (!titleResult.valid || !authorResult.valid || !yearResult.valid) {
      return;
    }

    onSubmit({
      title: titleGroup.input.value.trim(),
      author: authorGroup.input.value.trim(),
      year: parseInt(yearGroup.input.value.trim(), 10),
    });

    form.reset();
    [titleGroup, authorGroup, yearGroup].forEach((g) => setFieldError(g, undefined));
  });

  wrapper.appendChild(form);
  return wrapper;
}

interface FieldGroup {
  group: HTMLDivElement;
  input: HTMLInputElement;
  errorEl: HTMLDivElement;
}

function buildField(name: string, placeholder: string, type: string): FieldGroup {
  const group = document.createElement('div');
  group.className = 'mb-2';

  const input = document.createElement('input');
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.className = 'form-control';

  const errorEl = document.createElement('div');
  errorEl.className = 'text-danger small mt-1 d-none';

  group.appendChild(input);
  group.appendChild(errorEl);
  return { group, input, errorEl };
}

function setFieldError(field: FieldGroup, message?: string): void {
  if (message) {
    field.errorEl.textContent = message;
    field.errorEl.classList.remove('d-none');
    field.input.classList.add('is-invalid');
  } else {
    field.errorEl.textContent = '';
    field.errorEl.classList.add('d-none');
    field.input.classList.remove('is-invalid');
  }
}
