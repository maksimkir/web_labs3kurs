export interface Participant {
  id: string
  name: string
  /** Дата народження у форматі yyyy-mm-dd (значення input[type="date"]). */
  birthDate: string
  email: string
  phone: string
}

export type ParticipantFormValues = Omit<Participant, 'id'>
export type ParticipantField = keyof ParticipantFormValues
export type ParticipantErrors = Partial<Record<ParticipantField, string>>

export type SortField = 'name' | 'birthDate'
export type SortDirection = 'asc' | 'desc'

export interface SortState {
  field: SortField
  direction: SortDirection
}
