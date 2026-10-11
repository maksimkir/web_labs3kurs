/** Перетворює ISO-дату (UTC) у формат дд.мм.рррр. */
export function formatDob(isoDate: string): string {
  const date = new Date(isoDate)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${day}.${month}.${date.getUTCFullYear()}`
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
