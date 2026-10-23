/** yyyy-mm-dd → dd/mm/yyyy (як у дизайні таблиці). */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}
