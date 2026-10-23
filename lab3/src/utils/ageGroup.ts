import type { AgeGroup } from '@/types/user'

/** До 18 — minor, 18–30 — young, 31–50 — adult, понад 50 — senior. */
export function getAgeGroup(age: number): AgeGroup {
  if (age < 18) return 'minor'
  if (age <= 30) return 'young'
  if (age <= 50) return 'adult'
  return 'senior'
}
