import type { Participant, ParticipantErrors, ParticipantFormValues } from '@/types/participant'

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
/** Код країни +380 та 9 цифр. */
export const PHONE_PATTERN = /^\+380\d{9}$/
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const ERROR_MESSAGES = {
  required: 'This value is required.',
  email: 'Please enter a valid email address.',
  emailTaken: 'A participant with this email already exists.',
  phone: 'Phone must be in the format +380XXXXXXXXX.',
  dateInvalid: 'Please enter a valid date.',
  dateFuture: 'Date of birth cannot be in the future.',
} as const

/** Сьогоднішня дата за локальним часом у форматі yyyy-mm-dd. */
export function getTodayIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** E-mail порівнюється без урахування регістру та зайвих пробілів. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function isEmailTaken(
  email: string,
  participants: readonly Participant[],
  editingId?: string,
): boolean {
  const normalized = normalizeEmail(email)
  return participants.some((p) => p.id !== editingId && normalizeEmail(p.email) === normalized)
}

/**
 * Повертає помилки для кожного некоректного поля (порожній об'єкт — форма валідна).
 * `editingId` — id учасника, якого редагуємо: його власний e-mail дублікатом не вважається.
 */
export function validateParticipant(
  values: ParticipantFormValues,
  participants: readonly Participant[],
  editingId?: string,
): ParticipantErrors {
  const errors: ParticipantErrors = {}

  if (!values.name.trim()) {
    errors.name = ERROR_MESSAGES.required
  }

  if (!values.birthDate) {
    errors.birthDate = ERROR_MESSAGES.required
  } else if (!ISO_DATE_PATTERN.test(values.birthDate)) {
    errors.birthDate = ERROR_MESSAGES.dateInvalid
  } else if (values.birthDate > getTodayIso()) {
    errors.birthDate = ERROR_MESSAGES.dateFuture
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = ERROR_MESSAGES.required
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = ERROR_MESSAGES.email
  } else if (isEmailTaken(email, participants, editingId)) {
    errors.email = ERROR_MESSAGES.emailTaken
  }

  const phone = values.phone.trim()
  if (!phone) {
    errors.phone = ERROR_MESSAGES.required
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = ERROR_MESSAGES.phone
  }

  return errors
}
