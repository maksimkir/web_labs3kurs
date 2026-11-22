<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue'

// TODO: вписати свої дані
const STUDENT = {
  fullName: 'Прізвище Ім\'я По батькові',
  group: 'Група ___',
  github: 'https://github.com/maksimkir',
}

const SKILLS = [
  { area: 'Frontend', items: ['HTML5', 'CSS3 / SCSS', 'JavaScript (ES2023)', 'TypeScript'] },
  { area: 'Фреймворки й бібліотеки', items: ['Vue 3', 'Vue Router', 'Pinia', 'VeeValidate', 'Bootstrap 5'] },
  { area: 'Інструменти', items: ['Git, GitHub', 'Vite', 'ESLint, oxlint', 'npm'] },
]
</script>

<template>
  <section class="card">
    <div class="card-body-padded">
      <h1 class="about-view__name">
        {{ STUDENT.fullName }}
      </h1>
      <p class="about-view__group">
        {{ STUDENT.group }}
      </p>
      <a
        :href="STUDENT.github"
        class="btn btn-primary about-view__github"
        target="_blank"
        rel="noopener"
      >
        <BaseIcon name="github" />
        GitHub
      </a>
    </div>
  </section>

  <section class="card">
    <div class="card-body-padded">
      <h2 class="section-title">
        Technical skills
      </h2>
      <div class="about-view__skills">
        <div
          v-for="group in SKILLS"
          :key="group.area"
        >
          <h3 class="about-view__area">
            {{ group.area }}
          </h3>
          <ul class="about-view__list">
            <li
              v-for="skill in group.items"
              :key="skill"
              class="about-view__skill"
            >
              {{ skill }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-view__name {
  margin: 0;
  font-size: 1.5rem;
}

.about-view__group {
  margin: 0.25rem 0 1rem;
  color: var(--bs-secondary-color);
}

.about-view__github {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
}

.about-view__skills {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
}

.about-view__area {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.about-view__list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.about-view__skill {
  padding: 0.1875rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  background: var(--bs-primary);
  border-radius: 2px;
}
</style>
