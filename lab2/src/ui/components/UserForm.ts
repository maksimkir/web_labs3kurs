import { Validation } from '../../utils/validators';

export interface NewUserData {
  name: string;
  email: string;
}

export function createUserForm(onSubmit: (data: NewUserData) => void): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'card mb-4 p-3';

  const heading = document.createElement('h5');
  heading.textContent = 'Додати Користувача';
  wrapper.appendChild(heading);

  const form = document.createElement('form');
  form.noValidate = true;

  const nameGroup = buildField('name', "Ім'я");
  const emailGroup = buildField('email', 'Email');

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-success mt-2';
  submitBtn.textContent = 'Додати Користувача';

  form.appendChild(nameGroup.group);
  form.appendChild(emailGroup.group);
  form.appendChild(submitBtn);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameResult = Validation.required(nameGroup.input.value);
    const emailResult = Validation.isEmail(emailGroup.input.value);

    setFieldError(nameGroup, nameResult.message);
    setFieldError(emailGroup, emailResult.message);

    if (!nameResult.valid || !emailResult.valid) {
      return;
    }

    onSubmit({
      name: nameGroup.input.value.trim(),
      email: emailGroup.input.value.trim(),
    });

    form.reset();
    [nameGroup, emailGroup].forEach((g) => setFieldError(g, undefined));
  });

  wrapper.appendChild(form);
  return wrapper;
}

interface FieldGroup {
  group: HTMLDivElement;
  input: HTMLInputElement;
  errorEl: HTMLDivElement;
}

function buildField(name: string, placeholder: string): FieldGroup {
  const group = document.createElement('div');
  group.className = 'mb-2';

  const input = document.createElement('input');
  input.type = 'text';
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
