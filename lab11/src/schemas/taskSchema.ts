import { z } from 'zod'
import { CATEGORIES, PRIORITIES } from '../types/task'

export const TITLE_MAX_LENGTH = 80
export const DESCRIPTION_MAX_LENGTH = 300

/** Схема форми завдання: та сама для створення й редагування. */
export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Введіть назву завдання')
    .max(TITLE_MAX_LENGTH, `Не більше ${TITLE_MAX_LENGTH} символів`),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, `Не більше ${DESCRIPTION_MAX_LENGTH} символів`),
  category: z.enum(CATEGORIES, 'Оберіть категорію'),
  priority: z.enum(PRIORITIES, 'Оберіть пріоритет'),
})

export type TaskFormData = z.infer<typeof taskSchema>
