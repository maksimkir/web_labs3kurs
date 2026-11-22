<script setup lang="ts">
import ProgressSpinner from 'primevue/progressspinner'

withDefaults(defineProps<{ label?: string }>(), { label: 'Завантаження...' })
</script>

<template>
  <div
    class="app-spinner"
    role="status"
  >
    <ProgressSpinner
      class="app-spinner__icon"
      stroke-width="5"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
.app-spinner {
  display: flex;
  gap: 0.625rem;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.75rem;
  color: var(--p-text-muted-color);
}

.app-spinner__icon {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0;
}
</style>
