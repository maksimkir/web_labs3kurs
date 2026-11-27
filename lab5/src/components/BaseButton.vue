<script setup lang="ts">
type ButtonVariant = 'primary' | 'outline-primary' | 'outline-danger' | 'danger' | 'secondary'

withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: 'sm' | 'md'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)
</script>

<template>
  <!-- disabled, @click тощо потрапляють на <button> автоматично (fallthrough attrs) -->
  <button
    class="btn"
    :class="[`btn-${variant}`, { 'btn-sm': size === 'sm' }]"
    :type="type"
  >
    <slot />
  </button>
</template>
