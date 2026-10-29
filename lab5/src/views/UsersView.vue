<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import BasePagination from '@/components/BasePagination.vue'
import SearchBar from '@/components/SearchBar.vue'
import TheRegisterBlock from '@/components/TheRegisterBlock.vue'
import TheWinnersBlock from '@/components/TheWinnersBlock.vue'
import UsersTable from '@/components/users/UsersTable.vue'
import { PAGE_SIZE, useUsersQuery } from '@/composables/useUsersQuery'
import type { Page, PageParams } from '@/services/interfaces'
import { ServiceProvider } from '@/services/service-provider'
import { useUsersStore } from '@/stores/users'
import { fullName, type User } from '@/types/user'

const usersStore = useUsersStore()
const { page, search, sortBy, order, setPage, setSearch, toggleSort } = useUsersQuery()

// ---- Завантаження сторінки списку з API -------------------------------------

const serverPage = ref<Page<User> | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
let requestId = 0

async function load(): Promise<void> {
  const current = ++requestId
  isLoading.value = true
  error.value = null
  const params: PageParams = {
    limit: PAGE_SIZE,
    skip: (page.value - 1) * PAGE_SIZE,
    sortBy: sortBy.value,
    order: sortBy.value ? order.value : undefined,
  }
  try {
    const result = search.value
      ? await ServiceProvider.users.search(search.value, params)
      : await ServiceProvider.users.getAll(params)
    // відповідь на застарілий запит (користувач уже перейшов далі) ігноруємо
    if (current === requestId) serverPage.value = result
  } catch (e) {
    if (current === requestId) error.value = (e as Error).message
  } finally {
    if (current === requestId) isLoading.value = false
  }
}

// будь-яка зміна query-параметрів (сторінка, пошук, сортування) перезавантажує список
watch([page, search, sortBy, order], load, { immediate: true })

// локальні зміни (створення, редагування, видалення) накладаються на дані сервера
const visiblePage = computed(() =>
  serverPage.value ? usersStore.applyLocalChanges(serverPage.value, search.value) : null,
)
const users = computed(() => visiblePage.value?.items ?? [])
const totalPages = computed(() => Math.max(1, Math.ceil((visiblePage.value?.total ?? 0) / PAGE_SIZE)))
const emptyMessage = computed(() => (search.value ? 'No participants found.' : 'No participants yet.'))

// ---- Повідомлення про успішні дії -------------------------------------------

const notice = ref<string | null>(null)
let noticeTimer: ReturnType<typeof setTimeout> | undefined

function notify(message: string): void {
  notice.value = message
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => (notice.value = null), 4000)
}

// ---- Видалення з підтвердженням ---------------------------------------------

const deleting = ref<User | null>(null)
const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

function openDelete(user: User): void {
  deleting.value = user
  deleteError.value = null
  isDeleteOpen.value = true
}

async function confirmDelete(): Promise<void> {
  if (!deleting.value) return
  isDeleting.value = true
  deleteError.value = null
  try {
    // DELETE /users/:id; користувач прибирається з локального стану
    await usersStore.deleteUser(deleting.value.id)
    notify(`Учасника "${fullName(deleting.value)}" видалено`)
    isDeleteOpen.value = false
  } catch (e) {
    deleteError.value = (e as Error).message
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <TheWinnersBlock
    :winners="usersStore.winners"
    :can-draw="usersStore.canDrawWinner(users)"
    @draw="usersStore.drawWinner(users)"
    @remove="usersStore.removeWinner"
  />

  <TheRegisterBlock @created="notify(`Учасника &quot;${$event}&quot; додано до списку`)" />

  <section
    class="card"
    aria-labelledby="participants-title"
  >
    <div class="card-body-padded">
      <div class="users-view__toolbar">
        <h2
          id="participants-title"
          class="section-title mb-0"
        >
          Participants
        </h2>
        <SearchBar
          :value="search"
          @filter-by-name="setSearch"
        />
      </div>

      <p
        v-if="notice"
        class="alert alert-success py-2"
        role="status"
      >
        {{ notice }}
      </p>

      <div
        v-if="error"
        class="alert alert-danger d-flex users-view__error"
        role="alert"
      >
        <span>Не вдалося завантажити учасників: {{ error }}</span>
        <BaseButton
          variant="outline-danger"
          size="sm"
          @click="load"
        >
          Спробувати ще
        </BaseButton>
      </div>

      <div
        v-else-if="isLoading && !visiblePage"
        class="request-state"
      >
        <span
          class="spinner-border spinner-border-sm"
          aria-hidden="true"
        />
        Завантаження...
      </div>

      <template v-else-if="visiblePage">
        <div
          class="users-view__table"
          :class="{ 'users-view__table--loading': isLoading }"
          :aria-busy="isLoading"
        >
          <UsersTable
            :users="users"
            :offset="(page - 1) * PAGE_SIZE"
            :sort-by="sortBy"
            :order="order"
            :empty-message="emptyMessage"
            @sort="toggleSort"
            @remove="openDelete"
          />
        </div>
        <div class="users-view__footer">
          <span class="users-view__total">Total: {{ visiblePage.total }}</span>
          <BasePagination
            :page="page"
            :total-pages="totalPages"
            @change="setPage"
          />
        </div>
      </template>
    </div>

    <BaseModal
      :open="isDeleteOpen"
      @close="isDeleteOpen = false"
    >
      <template #header>
        Видалення учасника
      </template>
      <p
        v-if="deleting"
        class="mb-0"
      >
        Ви дійсно бажаєте видалити учасника "{{ fullName(deleting) }}", "{{ deleting.email }}"?
      </p>
      <p
        v-if="deleteError"
        class="alert alert-danger mt-3 mb-0"
        role="alert"
      >
        {{ deleteError }}
      </p>
      <template #footer>
        <BaseButton
          variant="danger"
          :disabled="isDeleting"
          @click="confirmDelete"
        >
          Так
        </BaseButton>
        <BaseButton
          variant="secondary"
          @click="isDeleteOpen = false"
        >
          Ні
        </BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<style scoped lang="scss">
.users-view__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.users-view__error {
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.users-view__table--loading {
  opacity: 0.55;
  transition: opacity 0.15s ease;
}

.users-view__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.875rem;
}

.users-view__total {
  color: var(--bs-secondary-color);
}
</style>
