<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'

const REPOSITORY_URL = 'https://github.com/maksimkir/web_labs3kurs'

const TECHNOLOGIES = [
  { name: 'Vue 3', note: 'Composition API, <script setup>' },
  { name: 'TypeScript', note: 'типізація моделей, сервісів і компонентів' },
  { name: 'Feature-Sliced Design', note: 'шари app, pages, widgets, features, entities, shared' },
  { name: 'Vue Router', note: 'вкладені й динамічні маршрути, guard-и, lazy loading' },
  { name: 'Pinia', note: 'setup stores: сесія, користувачі, лотерея, тема' },
  { name: 'PrimeVue', note: 'UI-бібліотека через обгортки в shared/ui' },
  { name: 'VeeValidate + zod', note: 'валідація форм' },
  { name: 'DummyJSON', note: 'REST API користувачів і JWT-авторизація' },
  { name: 'ESLint + oxlint + Steiger', note: 'style guide Vue і правила FSD' },
]
</script>

<template>
  <AppCard>
    <h1 class="home-page__title">
      Vue Lottery
    </h1>
    <p>
      Застосунок для проведення лотереї серед учасників. Список учасників завантажується з
      <a
        href="https://dummyjson.com/docs/users"
        target="_blank"
        rel="noopener"
      >DummyJSON Users</a>
      з пагінацією та пошуком, учасників можна додавати, редагувати й видаляти, а кнопка
      <strong>New winner</strong> випадково обирає до трьох переможців.
    </p>
    <p>
      Сторінка
      <!-- текст в один рядок, інакше підкреслення посилання захоплює пробіл після слова -->
      <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
      <RouterLink :to="{ name: 'users' }">Users</RouterLink>
      доступна лише після входу (JWT-авторизація через DummyJSON Auth).
    </p>
    <AppButton
      label="Проєкт на GitHub"
      icon="pi pi-github"
      variant="outlined"
      :href="REPOSITORY_URL"
    />
  </AppCard>

  <AppCard title="Технології">
    <ul class="home-page__technologies">
      <li
        v-for="technology in TECHNOLOGIES"
        :key="technology.name"
      >
        <strong>{{ technology.name }}</strong> — {{ technology.note }}
      </li>
    </ul>
  </AppCard>
</template>

<style scoped lang="scss">
.home-page__title {
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
}

.home-page__technologies {
  display: grid;
  gap: 0.375rem;
  padding-left: 1.25rem;
  margin: 0;
}
</style>
