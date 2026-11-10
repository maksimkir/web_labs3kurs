<script setup lang="ts">
import Tag from 'primevue/tag'

withDefaults(
  defineProps<{
    value: string
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'contrast'
  }>(),
  { severity: 'primary' },
)
</script>

<template>
  <Tag
    :value="value"
    :severity="severity === 'primary' ? undefined : severity"
  />
</template>
