import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { PASSWORD_MIN_LENGTH, REQUIRED_MESSAGE, requiredText } from '@/shared/lib'

/** Цифри, пробіли, дужки й дефіси, на початку може бути +. */
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/

/** При редагуванні пароль можна залишити порожнім (тоді він не змінюється). */
function userPassword(required: boolean) {
  return z
    .string()
    .optional()
    .superRefine((value = '', ctx) => {
      if (!value) {
        if (required) ctx.addIssue({ code: 'custom', message: REQUIRED_MESSAGE })
      } else if (value.length < PASSWORD_MIN_LENGTH) {
        ctx.addIssue({ code: 'custom', message: `Мінімум ${PASSWORD_MIN_LENGTH} символів` })
      }
    })
}

const userFields = {
  firstName: requiredText().max(50, 'Максимум 50 символів'),
  lastName: requiredText().max(50, 'Максимум 50 символів'),
  email: requiredText().email('Некоректний формат email'),
  username: requiredText().regex(USERNAME_PATTERN, 'Лише латиниця, цифри, _ та .'),
  // поле вводу повертає рядок, тому приводимо до числа ('' → 0 → помилка меж)
  age: z.coerce
    .number({ required_error: REQUIRED_MESSAGE, invalid_type_error: 'Вкажіть вік' })
    .int('Ціле число')
    .min(1, 'Вкажіть вік від 1 до 120')
    .max(120, 'Вкажіть вік від 1 до 120'),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: 'Оберіть стать' }) }),
  phone: requiredText().regex(PHONE_PATTERN, 'Формат: +380 50 123 4567'),
}

export function userSchema(passwordRequired: boolean) {
  return z.object({ ...userFields, password: userPassword(passwordRequired) })
}

export type UserFormValues = z.output<ReturnType<typeof userSchema>>

export const userFormSchema = (passwordRequired: boolean) =>
  toTypedSchema(userSchema(passwordRequired))
