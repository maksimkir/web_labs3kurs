import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { PRIORITIES, type Priority, type TaskFilter } from '../types/task'

const STATUSES: readonly TaskFilter[] = ['all', 'active', 'completed']

function parseStatus(value: string | null): TaskFilter {
  return STATUSES.includes(value as TaskFilter) ? (value as TaskFilter) : 'all'
}

function parsePriority(value: string | null): Priority | null {
  return PRIORITIES.includes(value as Priority) ? (value as Priority) : null
}

function parsePage(value: string | null): number {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

/**
 * Фільтри й сторінка живуть у URL: /tasks?status=completed&priority=high&page=2.
 * URL — єдине джерело правди: окремого useState для тих самих значень немає,
 * тож після F5 або при відкритті посилання стан відновлюється.
 */
export function useTaskFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = parseStatus(searchParams.get('status'))
  const priority = parsePriority(searchParams.get('priority'))
  const page = parsePage(searchParams.get('page'))

  const update = useCallback(
    (changes: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(changes)) {
          // значення за замовчуванням у URL не пишемо — посилання коротше
          if (value === null) next.delete(key)
          else next.set(key, value)
        }
        return next
      })
    },
    [setSearchParams],
  )

  const setStatus = useCallback((value: TaskFilter) => update({ status: value === 'all' ? null : value }), [update])
  const setPriority = useCallback((value: Priority | null) => update({ priority: value }), [update])
  const setPage = useCallback((value: number) => update({ page: value <= 1 ? null : String(value) }), [update])

  return { status, priority, page, setStatus, setPriority, setPage }
}
