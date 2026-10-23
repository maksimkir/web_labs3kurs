import type { Participant } from '@/types/participant'

export function isParticipant(value: unknown): value is Participant {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return ['id', 'name', 'birthDate', 'email', 'phone'].every(
    (key) => typeof candidate[key] === 'string',
  )
}

export function isParticipantList(value: unknown): value is Participant[] {
  return Array.isArray(value) && value.every(isParticipant)
}

export function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/** Читає й перевіряє дані з localStorage; при будь-якій проблемі повертає `fallback`. */
export function loadFromStorage<T>(
  key: string,
  isValid: (value: unknown) => value is T,
  fallback: T,
): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function saveToStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`Не вдалося зберегти "${key}" у localStorage`, error)
  }
}
