<script setup lang="ts">
import { computed, ref } from 'vue'
import UserCard from '@/components/UserCard.vue'
import { users } from '@/data/users'
import type { AgeFilter, GenderFilter, SortKey, User } from '@/types/user'

interface Option<T> {
  value: T
  label: string
}

const genderOptions: Option<GenderFilter>[] = [
  { value: 'all', label: 'Всі' },
  { value: 'male', label: 'Чоловіки' },
  { value: 'female', label: 'Жінки' },
]

const ageOptions: Option<AgeFilter>[] = [
  { value: 'all', label: 'Всі' },
  { value: 'adult', label: '18 +' },
]

const sortOptions: Option<SortKey>[] = [
  { value: 'name-asc', label: 'Ім’я ↑' },
  { value: 'name-desc', label: 'Ім’я ↓' },
  { value: 'age-asc', label: 'Вік ↑' },
  { value: 'age-desc', label: 'Вік ↓' },
]

const genderFilter = ref<GenderFilter>('all')
const ageFilter = ref<AgeFilter>('all')
const sortKey = ref<SortKey | null>(null)

const isDefaultState = computed(
  () => genderFilter.value === 'all' && ageFilter.value === 'all' && sortKey.value === null,
)

function compareByName(a: User, b: User): number {
  return (
    a.name.first.localeCompare(b.name.first, 'uk') || a.name.last.localeCompare(b.name.last, 'uk')
  )
}

function compareBy(key: SortKey): (a: User, b: User) => number {
  switch (key) {
    case 'name-asc':
      return compareByName
    case 'name-desc':
      return (a, b) => compareByName(b, a)
    case 'age-asc':
      return (a, b) => a.dob.age - b.dob.age
    case 'age-desc':
      return (a, b) => b.dob.age - a.dob.age
  }
}

// Спочатку фільтри, потім сортування — тому сортування не ламає фільтрацію.
const visibleUsers = computed<User[]>(() => {
  const filtered = users.filter(
    (user) =>
      (genderFilter.value === 'all' || user.gender === genderFilter.value) &&
      (ageFilter.value === 'all' || user.dob.age >= 18),
  )
  return sortKey.value === null ? filtered : [...filtered].sort(compareBy(sortKey.value))
})

function resetAll(): void {
  genderFilter.value = 'all'
  ageFilter.value = 'all'
  sortKey.value = null
}
</script>

<template>
  <section class="users">
    <header class="users__header">
      <h1 class="users__title">Користувачі</h1>
      <p class="users__count" aria-live="polite">Показано {{ visibleUsers.length }} з {{ users.length }}</p>
    </header>

    <div class="users__toolbar">
      <div class="users__group" role="group" aria-label="Фільтр за статтю">
        <span class="users__group-label">Стать</span>
        <button
          v-for="option in genderOptions"
          :key="option.value"
          class="users__button"
          :class="{ 'users__button--active': genderFilter === option.value }"
          type="button"
          :aria-pressed="genderFilter === option.value"
          @click="genderFilter = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="users__group" role="group" aria-label="Фільтр за віком">
        <span class="users__group-label">Вік</span>
        <button
          v-for="option in ageOptions"
          :key="option.value"
          class="users__button"
          :class="{ 'users__button--active': ageFilter === option.value }"
          type="button"
          :aria-pressed="ageFilter === option.value"
          @click="ageFilter = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="users__group" role="group" aria-label="Сортування">
        <span class="users__group-label">Сортування</span>
        <button
          v-for="option in sortOptions"
          :key="option.value"
          class="users__button"
          :class="{ 'users__button--active': sortKey === option.value }"
          type="button"
          :aria-pressed="sortKey === option.value"
          @click="sortKey = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <button class="users__button users__button--reset" type="button" :disabled="isDefaultState" @click="resetAll">
        Очистити все
      </button>
    </div>

    <p v-if="visibleUsers.length === 0" class="users__empty">Список юзерів пустий</p>
    <ul v-else class="users__list">
      <li v-for="user in visibleUsers" :key="user.id">
        <UserCard :user="user" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.users {
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 20px 64px;
}

.users__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 24px;
  margin-bottom: 20px;
}

.users__title {
  margin: 0;
  font-size: 2rem;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.users__count {
  margin: 0;
  color: var(--muted);
}

.users__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 28px;
  margin-bottom: 24px;
  padding: 14px 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
}

.users__group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.users__group-label {
  margin-right: 4px;
  font-size: 0.9375rem;
  color: var(--muted);
}

.users__button {
  padding: 7px 16px;
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--ink);
  cursor: pointer;
  background: var(--panel);
  border: 1px solid transparent;
  border-radius: 999px;
}

.users__button:hover:not(:disabled) {
  border-color: var(--ink-soft);
}

.users__button:focus-visible {
  outline: 3px solid var(--ink);
  outline-offset: 2px;
}

.users__button--active {
  color: #fff;
  background: var(--ink);
}

.users__button--reset {
  margin-left: auto;
  background: transparent;
  border-color: var(--line);
}

.users__button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.users__list {
  display: grid;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.users__empty {
  margin: 0;
  padding: 56px 20px;
  font-size: 1.125rem;
  color: var(--muted);
  text-align: center;
  background: var(--surface);
  border: 1px dashed var(--line);
  border-radius: 14px;
}
</style>
