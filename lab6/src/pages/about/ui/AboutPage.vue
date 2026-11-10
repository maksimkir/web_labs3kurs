<script setup lang="ts">
import { AppButton, AppCard, AppTag } from '@/shared/ui'

// TODO: вписати свої дані
const STUDENT = {
  fullName: 'Прізвище Ім\'я По батькові',
  group: 'Група ___',
  github: 'https://github.com/maksimkir',
}

const SKILLS = [
  { area: 'Frontend', items: ['HTML5', 'CSS3 / SCSS', 'JavaScript (ES2023)', 'TypeScript'] },
  {
    area: 'Фреймворки й бібліотеки',
    items: ['Vue 3', 'Vue Router', 'Pinia', 'VeeValidate', 'PrimeVue'],
  },
  { area: 'Інструменти', items: ['Git, GitHub', 'Vite', 'ESLint, oxlint, Steiger', 'npm'] },
]
</script>

<template>
  <AppCard>
    <h1 class="about-page__name">
      {{ STUDENT.fullName }}
    </h1>
    <p class="about-page__group">
      {{ STUDENT.group }}
    </p>
    <AppButton
      label="GitHub"
      icon="pi pi-github"
      :href="STUDENT.github"
    />
  </AppCard>

  <AppCard title="Technical skills">
    <div class="about-page__skills">
      <div
        v-for="group in SKILLS"
        :key="group.area"
      >
        <h3 class="about-page__area">
          {{ group.area }}
        </h3>
        <ul class="about-page__list">
          <li
            v-for="skill in group.items"
            :key="skill"
          >
            <AppTag :value="skill" />
          </li>
        </ul>
      </div>
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.about-page__name {
  margin: 0;
  font-size: 1.5rem;
}

.about-page__group {
  margin: 0.25rem 0 1rem;
  color: var(--p-text-muted-color);
}

.about-page__skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.about-page__area {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
}

.about-page__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
