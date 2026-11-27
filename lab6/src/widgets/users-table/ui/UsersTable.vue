<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { fullName, useUsersStore, type User, type UserSortField } from '@/entities/user'
import {
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppMessage,
  AppPaginator,
  AppSearchInput,
  AppSpinner,
  AppTable,
  useAppToast,
  type AppTableColumn,
  type AppTableSortOrder,
} from '@/shared/ui'

// Стан пагінації, пошуку й сортування належить сторінці (він у query-параметрах URL),
// а дані — стору користувачів.
const props = defineProps<{
  page: number
  pageSize: number
  search: string
  sortBy?: UserSortField
  order: AppTableSortOrder
}>()

const emit = defineEmits<{
  'update:page': [page: number]
  'update:search': [search: string]
  sort: [field: UserSortField, order: AppTableSortOrder]
  retry: []
}>()

const usersStore = useUsersStore()
const { users, total, isLoading, isLoaded, error } = storeToRefs(usersStore)
const toast = useAppToast()

const COLUMNS: AppTableColumn[] = [
  { field: 'index', header: '#', style: 'width: 3rem' },
  { field: 'firstName', header: 'Name', sortable: true },
  { field: 'age', header: 'Age', sortable: true },
  { field: 'username', header: 'Username' },
  { field: 'email', header: 'Email' },
  { field: 'phone', header: 'Phone number' },
  { field: 'actions', header: '' },
]

const SORT_FIELDS: readonly string[] = ['firstName', 'age'] satisfies UserSortField[]

const emptyMessage = computed(() => (props.search ? 'No participants found.' : 'No participants yet.'))

function onSort(field: string, order: AppTableSortOrder): void {
  if (SORT_FIELDS.includes(field)) emit('sort', field as UserSortField, order)
}

// ---- видалення з підтвердженням --------------------------------------------

const deleting = ref<User | null>(null)
const isConfirmOpen = ref(false)
const isDeleting = ref(false)

const confirmMessage = computed(() =>
  deleting.value
    ? `Ви дійсно бажаєте видалити учасника "${fullName(deleting.value)}", "${deleting.value.email}"?`
    : '',
)

function askDelete(user: User): void {
  deleting.value = user
  isConfirmOpen.value = true
}

async function confirmDelete(): Promise<void> {
  const user = deleting.value
  if (!user) return
  isDeleting.value = true
  try {
    // DELETE /users/:id; стор прибирає користувача з локального стану
    await usersStore.removeUser(user.id)
    toast.success('Користувача видалено', fullName(user))
    isConfirmOpen.value = false
  } catch (e) {
    toast.error('Не вдалося видалити користувача', (e as Error).message)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <AppCard>
    <template #title>
      <div class="users-table__toolbar">
        <h2 class="users-table__title">
          Participants
        </h2>
        <AppSearchInput
          :value="search"
          label="Search participants by name"
          placeholder="Search by name"
          @search="emit('update:search', $event)"
        />
      </div>
    </template>

    <AppMessage
      v-if="error"
      severity="error"
    >
      <div class="users-table__error">
        <span>Не вдалося завантажити учасників: {{ error }}</span>
        <AppButton
          label="Спробувати ще"
          severity="danger"
          variant="outlined"
          size="small"
          @click="emit('retry')"
        />
      </div>
    </AppMessage>

    <AppSpinner v-else-if="isLoading && !isLoaded" />

    <template v-else-if="isLoaded">
      <AppTable
        :rows="users"
        :columns="COLUMNS"
        :loading="isLoading"
        :sort-field="sortBy"
        :sort-order="order"
        :empty-message="emptyMessage"
        @sort="onSort"
      >
        <template #cell-index="{ index }">
          {{ (page - 1) * pageSize + index + 1 }}
        </template>
        <template #cell-firstName="{ row }">
          <!-- динамічний маршрут /users/:id -->
          <RouterLink
            class="users-table__name"
            :to="{ name: 'user', params: { id: row.id } }"
          >
            {{ fullName(row) }}
          </RouterLink>
        </template>
        <template #cell-actions="{ row }">
          <div class="users-table__actions">
            <!-- вкладений маршрут /users/:id/edit -->
            <AppButton
              label="Редагувати дані"
              icon="pi pi-pencil"
              variant="outlined"
              size="small"
              :to="{ name: 'user-edit', params: { id: row.id } }"
            />
            <AppButton
              label="Видалити учасника"
              icon="pi pi-trash"
              severity="danger"
              variant="outlined"
              size="small"
              @click="askDelete(row)"
            />
          </div>
        </template>
      </AppTable>

      <div class="users-table__footer">
        <span class="users-table__total">Total: {{ total }}</span>
        <AppPaginator
          :page="page"
          :rows="pageSize"
          :total-records="total"
          @change="emit('update:page', $event)"
        />
      </div>
    </template>

    <AppConfirmDialog
      v-model:visible="isConfirmOpen"
      header="Видалення учасника"
      :message="confirmMessage"
      :loading="isDeleting"
      @confirm="confirmDelete"
    />
  </AppCard>
</template>

<style scoped lang="scss">
.users-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.users-table__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
}

.users-table__error {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.users-table__name {
  font-weight: 600;
  color: var(--p-primary-color);
  text-decoration: none;
  white-space: nowrap;
}

.users-table__actions {
  display: flex;
  gap: 0.375rem;
  white-space: nowrap;
}

.users-table__footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.875rem;
}

.users-table__total {
  color: var(--p-text-muted-color);
}
</style>
