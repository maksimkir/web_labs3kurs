import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { HttpError, ServiceProvider, type Page, type PageParams } from '@/shared/api'
import { USER_SERVICE_KEY, type UserRepository } from '../api/user.service'
import { fullName, type CreateUserDto, type UpdateUserDto, type User, type UserSortField } from './types'

export interface FetchUsersParams {
  page: number
  limit: number
  search?: string
  sortBy?: UserSortField
  order?: 'asc' | 'desc'
}

function matchesQuery(user: User, query: string): boolean {
  const q = query.trim().toLowerCase()
  return !q || `${fullName(user)} ${user.username} ${user.email}`.toLowerCase().includes(q)
}

// сервіс береться з реєстру; компоненти до нього напряму не звертаються
const userService = () => ServiceProvider.get<UserRepository>(USER_SERVICE_KEY)

// Setup store користувачів: список, поточний користувач і CRUD-дії.
// DummyJSON лише імітує POST, PUT і DELETE, тому після успішної відповіді стор сам
// запам'ятовує створених, оновлених і видалених користувачів (created / updated /
// deletedIds) і накладає ці зміни на кожну сторінку з API.
export const useUsersStore = defineStore(
  'users',
  () => {
    // ---- state ----
    const serverPage = ref<Page<User> | null>(null)
    const query = ref('')
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const currentUser = ref<User | null>(null)
    const isUserLoading = ref(false)
    const userError = ref<string | null>(null)

    const created = ref<User[]>([])
    const updated = ref<Record<number, User>>({})
    const deletedIds = ref<number[]>([])

    // ---- getters ----
    const visiblePage = computed(() => {
      const page = serverPage.value
      if (!page) return null
      const deleted = new Set(deletedIds.value)
      const items = page.items
        .filter((u) => !deleted.has(u.id))
        .map((u) => updated.value[u.id] ?? u)
      const extra = created.value.filter((u) => matchesQuery(u, query.value))
      const removedCount = query.value ? page.items.length - items.length : deleted.size
      return {
        // нові учасники показуються першими на першій сторінці
        items: page.skip === 0 ? [...extra, ...items] : items,
        total: Math.max(0, page.total + extra.length - removedCount),
      }
    })

    const users = computed(() => visiblePage.value?.items ?? [])
    const total = computed(() => visiblePage.value?.total ?? 0)
    const hasUsers = computed(() => users.value.length > 0)
    const isLoaded = computed(() => serverPage.value !== null)

    // ---- actions ----
    let requestId = 0

    async function fetchUsers({ page, limit, search = '', sortBy, order }: FetchUsersParams): Promise<void> {
      const current = ++requestId
      isLoading.value = true
      error.value = null
      const params: PageParams = {
        limit,
        skip: (page - 1) * limit,
        sortBy,
        order: sortBy ? order : undefined,
      }
      try {
        const result = search
          ? await userService().search(search, params)
          : await userService().getAll(params)
        // відповідь на застарілий запит (користувач уже перейшов далі) ігноруємо
        if (current !== requestId) return
        serverPage.value = result
        query.value = search
      } catch (e) {
        if (current === requestId) error.value = (e as Error).message
      } finally {
        if (current === requestId) isLoading.value = false
      }
    }

    function findLocal(id: number): User | undefined {
      return created.value.find((u) => u.id === id) ?? updated.value[id]
    }

    async function fetchUser(id: number): Promise<void> {
      isUserLoading.value = true
      userError.value = null
      currentUser.value = null
      try {
        if (deletedIds.value.includes(id)) {
          throw new HttpError(404, `Користувача з id ${id} видалено`)
        }
        currentUser.value = findLocal(id) ?? (await userService().getById(id))
      } catch (e) {
        userError.value = (e as Error).message
      } finally {
        isUserLoading.value = false
      }
    }

    async function createUser(data: CreateUserDto): Promise<User> {
      const response = await userService().create(data)
      // сервер щоразу повертає той самий id (total + 1), тож робимо його унікальним локально
      const id = Math.max(response.id, ...created.value.map((u) => u.id + 1))
      const user: User = { ...response, ...data, id }
      created.value.unshift(user)
      return user
    }

    async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
      const local = created.value.find((u) => u.id === id)
      let user: User
      if (local) {
        // такого користувача немає на сервері (PUT повернув би 404), тож оновлюємо лише локально
        user = { ...local, ...data }
        created.value = created.value.map((u) => (u.id === id ? user : u))
      } else {
        const response = await userService().update(id, data)
        user = { ...response, ...data, id }
        updated.value = { ...updated.value, [id]: user }
      }
      if (currentUser.value?.id === id) currentUser.value = user
      return user
    }

    async function removeUser(id: number): Promise<void> {
      if (created.value.some((u) => u.id === id)) {
        created.value = created.value.filter((u) => u.id !== id)
      } else {
        await userService().delete(id)
        deletedIds.value.push(id)
      }
      if (currentUser.value?.id === id) currentUser.value = null
    }

    return {
      serverPage,
      query,
      isLoading,
      error,
      currentUser,
      isUserLoading,
      userError,
      created,
      updated,
      deletedIds,
      users,
      total,
      hasUsers,
      isLoaded,
      fetchUsers,
      fetchUser,
      createUser,
      updateUser,
      removeUser,
    }
  },
  {
    // pinia-plugin-persistedstate: у localStorage потрапляють лише локальні зміни
    persist: { pick: ['created', 'updated', 'deletedIds'] },
  },
)
