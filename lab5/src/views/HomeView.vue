<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'

const REPOSITORY_URL = 'https://github.com/maksimkir/web_labs3kurs'

const TECHNOLOGIES = [
  { name: 'Vue 3', note: 'Composition API, <script setup>' },
  { name: 'TypeScript', note: 'типізація моделей, сервісів і компонентів' },
  { name: 'Vue Router', note: 'вкладені й динамічні маршрути, guard-и, lazy loading' },
  { name: 'Pinia', note: 'стан авторизації та локальні зміни списку' },
  { name: 'VeeValidate + zod', note: 'валідація форм' },
  { name: 'Bootstrap 5 + SCSS', note: 'імпорт лише потрібних стилів' },
  { name: 'DummyJSON', note: 'REST API користувачів і JWT-авторизація' },
  { name: 'ESLint + oxlint', note: 'style guide Vue' },
]
</script>

<template>
  <section class="card">
    <div class="card-body-padded">
      <h1 class="home-view__title">
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
        Сторінка <RouterLink :to="{ name: 'users' }">
          Users
        </RouterLink> доступна лише після входу
        (JWT-авторизація через DummyJSON Auth).
      </p>
      <a
        :href="REPOSITORY_URL"
        class="btn btn-outline-primary home-view__github"
        target="_blank"
        rel="noopener"
      >
        <BaseIcon name="github" />
        Проєкт на GitHub
      </a>
    </div>
  </section>

  <section class="card">
    <div class="card-body-padded">
      <h2 class="section-title">
        Технології
      </h2>
      <ul class="home-view__technologies">
        <li
          v-for="technology in TECHNOLOGIES"
          :key="technology.name"
        >
          <strong>{{ technology.name }}</strong> — {{ technology.note }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-view__title {
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.home-view__github {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}

.home-view__technologies {
  display: grid;
  gap: 0.375rem;
  padding-left: 1.25rem;
  margin: 0;
}
</style>
