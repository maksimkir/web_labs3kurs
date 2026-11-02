import { computed } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import type { UserSortField } from '@/entities/user'

export const PAGE_SIZE = 10

const SORT_FIELDS: readonly UserSortField[] = ['firstName', 'age']

function single(value: unknown): string {
  const item = Array.isArray(value) ? value[0] : value
  return typeof item === 'string' ? item : ''
}

/**
 * Стан списку (сторінка, пошук, сортування) зберігається в query-параметрах URL:
 * /users?page=2&q=john&sort=age&order=desc — посиланням можна поділитися.
 */
export function useUsersQuery() {
  const route = useRoute()
  const router = useRouter()

  const page = computed(() => {
    const value = Number.parseInt(single(route.query.page), 10)
    return Number.isFinite(value) && value > 0 ? value : 1
  })
  const search = computed(() => single(route.query.q).trim())
  const sortBy = computed(() => {
    const value = single(route.query.sort) as UserSortField
    return SORT_FIELDS.includes(value) ? value : undefined
  })
  const order = computed<'asc' | 'desc'>(() => (single(route.query.order) === 'desc' ? 'desc' : 'asc'))

  function update(patch: LocationQueryRaw): void {
    const query: LocationQueryRaw = { ...route.query, ...patch }
    // значення за замовчуванням не засмічують URL
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === '' || (key === 'page' && value === 1)) delete query[key]
    }
    router.push({ query })
  }

  function setPage(value: number): void {
    update({ page: value })
  }

  function setSearch(value: string): void {
    // новий пошук починається з першої сторінки
    update({ q: value, page: 1 })
  }

  function setSort(field: UserSortField, nextOrder: 'asc' | 'desc'): void {
    update({ sort: field, order: nextOrder, page: 1 })
  }

  return { page, search, sortBy, order, setPage, setSearch, setSort }
}
