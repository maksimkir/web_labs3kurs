<script setup lang="ts">
import AppLogo from '@/components/layout/AppLogo.vue'
</script>

<template>
  <div class="auth-layout">
    <AppLogo />
    <main class="auth-layout__content">
      <slot />
    </main>
    <RouterLink
      :to="{ name: 'home' }"
      class="auth-layout__back"
    >
      &larr; На головну
    </RouterLink>
  </div>
</template>

<style scoped lang="scss">
.auth-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
}

.auth-layout__content {
  width: 100%;
  max-width: 24rem;
}

.auth-layout__back {
  color: var(--bs-secondary-color);
  text-decoration: none;

  &:hover {
    color: var(--bs-primary);
  }
}
</style>
