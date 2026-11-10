<script setup lang="ts">
import Chip from 'primevue/chip'

defineProps<{
  label: string
  removable?: boolean
  /** Підпис кнопки видалення для екранних читачів. */
  removeLabel?: string
}>()

const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <Chip
    :label="label"
    :removable="removable"
    :pt="{ removeIcon: { 'aria-label': removeLabel ?? `Remove ${label}`, role: 'button', tabindex: 0 } }"
    @remove="emit('remove')"
  />
</template>
