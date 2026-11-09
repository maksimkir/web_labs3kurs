<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { fullName, type User, type UserSortField } from '@/types/user'

const props = defineProps<{
  users: readonly User[]
  /** Номер першого рядка (з урахуванням пагінації). */
  offset: number
  sortBy?: UserSortField
  order: 'asc' | 'desc'
  emptyMessage: string
}>()

const emit = defineEmits<{
  sort: [field: UserSortField]
  remove: [user: User]
}>()

const COLUMN_COUNT = 8

function ariaSort(field: UserSortField): 'ascending' | 'descending' | 'none' {
  if (props.sortBy !== field) return 'none'
  return props.order === 'asc' ? 'ascending' : 'descending'
}

function isDesc(field: UserSortField): boolean {
  return props.sortBy === field && props.order === 'desc'
}
</script>

<template>
  <div class="users-table__scroll">
    <table class="table users-table">
      <thead>
        <tr>
          <th
            scope="col"
            class="users-table__index"
          >
            #
          </th>
          <th
            scope="col"
            :aria-sort="ariaSort('firstName')"
          >
            <button
              class="sort-button"
              :class="{ 'sort-button--active': sortBy === 'firstName' }"
              type="button"
              @click="emit('sort', 'firstName')"
            >
              Name
              <BaseIcon :name="isDesc('firstName') ? 'sort-alpha-down-alt' : 'sort-alpha-down'" />
            </button>
          </th>
          <th
            scope="col"
            :aria-sort="ariaSort('age')"
          >
            <button
              class="sort-button"
              :class="{ 'sort-button--active': sortBy === 'age' }"
              type="button"
              @click="emit('sort', 'age')"
            >
              Age
              <BaseIcon :name="isDesc('age') ? 'sort-down-alt' : 'sort-down'" />
            </button>
          </th>
          <th scope="col">
            Username
          </th>
          <th scope="col">
            Email
          </th>
          <th scope="col">
            Phone number
          </th>
          <th scope="col">
            <span class="visually-hidden">Edit</span>
          </th>
          <th scope="col">
            <span class="visually-hidden">Delete</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="users.length > 0">
          <tr
            v-for="(user, index) in users"
            :key="user.id"
          >
            <td class="users-table__index">
              {{ offset + index + 1 }}
            </td>
            <td>
              <!-- динамічний маршрут /users/:id -->
              <RouterLink :to="{ name: 'user', params: { id: user.id } }">
                {{ fullName(user) }}
              </RouterLink>
            </td>
            <td>{{ user.age }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <!-- вкладений маршрут /users/:id/edit -->
              <RouterLink
                :to="{ name: 'user-edit', params: { id: user.id } }"
                class="btn btn-outline-primary btn-sm"
              >
                <BaseIcon
                  name="pencil"
                  :size="13"
                />
                Редагувати дані
              </RouterLink>
            </td>
            <td>
              <BaseButton
                variant="outline-danger"
                size="sm"
                @click="emit('remove', user)"
              >
                <BaseIcon
                  name="trash"
                  :size="13"
                />
                Видалити учасника
              </BaseButton>
            </td>
          </tr>
        </template>
        <tr v-else>
          <td
            class="users-table__empty"
            :colspan="COLUMN_COUNT"
          >
            {{ emptyMessage }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.users-table__scroll {
  // relative — щоб приховані підписи (.visually-hidden) не розтягували сторінку по горизонталі
  position: relative;
  overflow-x: auto;
}

.users-table {
  margin-bottom: 0;
  font-size: 0.875rem;
  white-space: nowrap;

  th {
    font-weight: 700;
    color: var(--lottery-ink);
    vertical-align: middle;
  }

  td {
    color: var(--bs-secondary-color);
    vertical-align: middle;
  }

  th,
  td {
    padding: 0.625rem 0.5rem;
  }

  a:not(.btn) {
    font-weight: 600;
    text-decoration: none;
  }

  .btn-sm {
    --bs-btn-padding-x: 0.5rem;
    --bs-btn-font-size: 0.75rem;

    display: inline-flex;
    gap: 0.25rem;
    align-items: center;
  }
}

.users-table__index {
  width: 2.5rem;
  color: var(--bs-secondary-color);
}

.users-table__empty {
  padding: 1.5rem 0.75rem;
  text-align: center;
}

.sort-button {
  display: inline-flex;
  gap: 0.375rem;
  align-items: center;
  padding: 0;
  font: inherit;
  font-weight: 700;
  color: inherit;
  cursor: pointer;
  background: none;
  border: 0;

  &:hover,
  &--active {
    color: var(--bs-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--bs-primary);
    outline-offset: 3px;
  }
}
</style>
