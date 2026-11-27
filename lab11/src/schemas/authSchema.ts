import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 6

/**
 * Схема форми входу. Мінімальна довжина пароля — навчальна перевірка форми,
 * а не правило безпеки.
 */
export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Введіть username'),
  password: z
    .string()
    .min(1, 'Введіть пароль')
    .min(PASSWORD_MIN_LENGTH, `Пароль — щонайменше ${PASSWORD_MIN_LENGTH} символів`),
})

export type LoginFormData = z.infer<typeof loginSchema>
