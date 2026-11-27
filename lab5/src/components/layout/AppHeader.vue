<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <AppLogo />
      <AppNavigation />
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: #fff;
  border-bottom: 1px solid var(--bs-border-color);
}

.app-header__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  align-items: center;
  justify-content: space-between;
  max-width: 68rem;
  padding: 0.75rem 1rem;
  margin: 0 auto;
}
</style>
