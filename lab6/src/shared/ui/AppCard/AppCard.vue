<script setup lang="ts">
import Card from 'primevue/card'

defineProps<{ title?: string }>()
</script>

<template>
  <Card class="app-card">
    <template
      v-if="title || $slots.title"
      #title
    >
      <slot name="title">
        <h2 class="app-card__title">
          {{ title }}
        </h2>
      </slot>
    </template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>

<style scoped lang="scss">
.app-card__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
