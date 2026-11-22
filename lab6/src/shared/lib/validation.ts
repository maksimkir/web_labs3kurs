import { z } from 'zod'

// Спільні правила валідації (zod) для форм входу й користувача.

export const REQUIRED_MESSAGE = "Обов'язкове поле"
export const PASSWORD_MIN_LENGTH = 6

export function requiredText() {
  return z.string({ required_error: REQUIRED_MESSAGE }).trim().min(1, REQUIRED_MESSAGE)
}

export function passwordRule() {
  return z
    .string({ required_error: REQUIRED_MESSAGE })
    .min(1, REQUIRED_MESSAGE)
    .min(PASSWORD_MIN_LENGTH, `Мінімум ${PASSWORD_MIN_LENGTH} символів`)
}

/** Стан поля VeeValidate → props для AppInput / AppSelect. */
export const fieldStateProps = {
  props: (state: { touched: boolean; valid: boolean; errors: string[] }) => ({
    // помилка показується після blur або спроби відправки
    error: state.touched ? state.errors[0] : undefined,
    valid: state.touched && state.valid,
  }),
}
