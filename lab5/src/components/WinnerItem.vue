<script setup lang="ts">
defineProps<{ name: string }>()
const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <li class="winner-item">
    <span>{{ name }}</span>
    <button
      class="winner-item__remove"
      type="button"
      :aria-label="`Remove winner ${name}`"
      @click="emit('remove')"
    >
      x
    </button>
  </li>
</template>

<style scoped lang="scss">
.winner-item {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.1875rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  background: var(--bs-primary);
  border-radius: 2px;
}

.winner-item__remove {
  padding: 0 0.125rem;
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: none;
  border: 0;

  &:hover {
    opacity: 0.75;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 1px;
  }
}
</style>
