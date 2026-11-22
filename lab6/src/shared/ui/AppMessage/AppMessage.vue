<script setup lang="ts">
import Message from 'primevue/message'

withDefaults(defineProps<{ severity?: 'success' | 'info' | 'warn' | 'error' }>(), {
  severity: 'info',
})
</script>

<template>
  <Message
    :severity="severity"
    :role="severity === 'error' ? 'alert' : 'status'"
  >
    <slot />
  </Message>
</template>
