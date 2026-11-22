/** yyyy-m-d (формат DummyJSON) → dd/mm/yyyy. */
export function formatDate(isoDate: string): string {
  const [year, month = '', day = ''] = isoDate.split('-')
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}
