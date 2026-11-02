import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { HttpError } from '@/api/http-client'
import type { Page } from '@/services/interfaces'
import { ServiceProvider } from '@/services/service-provider'
import { fullName, type CreateUserDto, type UpdateUserDto, type User } from '@/types/user'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

export const MAX_WINNERS = 3

const STORAGE_KEYS = {
  changes: 'vue-lottery:local-changes',
  winners: 'vue-lottery:winners',
} as const

interface LocalChanges {
  created: User[]
  updated: Record<number, User>
  deletedIds: number[]
}

function matchesQuery(user: User, query: string): boolean {
  const q = query.trim().toLowerCase()
  return !q || `${fullName(user)} ${user.username} ${user.email}`.toLowerCase().includes(q)
}

// DummyJSON лише імітує POST, PUT і DELETE: сервер відповідає успіхом, але дані не змінює.
// Тому після успішної відповіді стор сам пам'ятає створених, оновлених і видалених
// користувачів і накладає ці зміни на кожну сторінку, отриману з API.
export const useUsersStore = defineStore('users', () => {
  const saved = loadFromStorage<LocalChanges>(STORAGE_KEYS.changes, {
    created: [],
    updated: {},
    deletedIds: [],
  })
  const created = ref<User[]>(saved.created)
  const updated = ref<Record<number, User>>(saved.updated)
  const deletedIds = ref<number[]>(saved.deletedIds)
  const winners = ref<User[]>(loadFromStorage<User[]>(STORAGE_KEYS.winners, []))

  watch(
    [created, updated, deletedIds],
    () =>
      saveToStorage(STORAGE_KEYS.changes, {
        created: created.value,
        updated: updated.value,
        deletedIds: deletedIds.value,
      }),
    { deep: true },
  )
  watch(winners, (value) => saveToStorage(STORAGE_KEYS.winners, value), { deep: true })

  // ---- Локальні зміни ---------------------------------------------------------

  function findCreated(id: number): User | undefined {
    return created.value.find((u) => u.id === id)
  }

  /** Накладає локальні зміни на сторінку з API. Нові учасники показуються на першій сторінці. */
  function applyLocalChanges(page: Page<User>, query = ''): Page<User> {
    const deleted = new Set(deletedIds.value)
    const items = page.items
      .filter((u) => !deleted.has(u.id))
      .map((u) => updated.value[u.id] ?? u)
    const extra = created.value.filter((u) => matchesQuery(u, query))
    const removedCount = query ? page.items.length - items.length : deleted.size

    return {
      ...page,
      items: page.skip === 0 ? [...extra, ...items] : items,
      total: Math.max(0, page.total + extra.length - removedCount),
    }
  }

  async function getUser(id: number): Promise<User> {
    const local = findCreated(id) ?? updated.value[id]
    if (local) return local
    if (deletedIds.value.includes(id)) {
      throw new HttpError(404, `Користувача з id ${id} видалено`)
    }
    return ServiceProvider.users.getById(id)
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const response = await ServiceProvider.users.create(data)
    // сервер щоразу повертає той самий id (total + 1), тож робимо його унікальним локально
    const id = Math.max(response.id, ...created.value.map((u) => u.id + 1))
    const user: User = { ...response, ...data, id }
    created.value.unshift(user)
    return user
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const local = findCreated(id)
    let user: User
    if (local) {
      // такого користувача немає на сервері (PUT повернув би 404), тож оновлюємо лише локально
      user = { ...local, ...data }
      created.value = created.value.map((u) => (u.id === id ? user : u))
    } else {
      const response = await ServiceProvider.users.update(id, data)
      user = { ...response, ...data, id }
      updated.value = { ...updated.value, [id]: user }
    }
    winners.value = winners.value.map((w) => (w.id === id ? user : w))
    return user
  }

  async function deleteUser(id: number): Promise<void> {
    if (findCreated(id)) {
      created.value = created.value.filter((u) => u.id !== id)
    } else {
      await ServiceProvider.users.delete(id)
      deletedIds.value.push(id)
    }
    // видалений учасник зникає і з блоку переможців
    removeWinner(id)
  }

  function resetLocalChanges(): void {
    created.value = []
    updated.value = {}
    deletedIds.value = []
  }

  // ---- Лотерея ----------------------------------------------------------------

  const isWinnersFull = computed(() => winners.value.length >= MAX_WINNERS)

  function candidates(pool: readonly User[]): User[] {
    return pool.filter((u) => !winners.value.some((w) => w.id === u.id))
  }

  function canDrawWinner(pool: readonly User[]): boolean {
    return !isWinnersFull.value && candidates(pool).length > 0
  }

  /** Переможець обирається серед учасників поточної сторінки, які ще не перемагали. */
  function drawWinner(pool: readonly User[]): void {
    if (!canDrawWinner(pool)) return
    const available = candidates(pool)
    const winner = available[Math.floor(Math.random() * available.length)]
    if (winner) winners.value.push(winner)
  }

  function removeWinner(id: number): void {
    winners.value = winners.value.filter((w) => w.id !== id)
  }

  return {
    created,
    updated,
    deletedIds,
    winners,
    applyLocalChanges,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    resetLocalChanges,
    canDrawWinner,
    drawWinner,
    removeWinner,
  }
})
