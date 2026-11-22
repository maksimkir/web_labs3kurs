<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    label?: string
    /** Клас іконки primeicons, наприклад "pi pi-pencil". */
    icon?: string
    severity?: 'primary' | 'secondary' | 'danger' | 'success' | 'contrast'
    variant?: 'filled' | 'outlined' | 'text' | 'link'
    size?: 'small' | 'medium' | 'large'
    type?: 'button' | 'submit' | 'reset'
    loading?: boolean
    disabled?: boolean
    /** Кнопка-посилання всередині застосунку (RouterLink). */
    to?: RouteLocationRaw
    /** Кнопка-посилання на зовнішній сайт. */
    href?: string
  }>(),
  {
    label: undefined,
    icon: undefined,
    severity: 'primary',
    variant: 'filled',
    size: 'medium',
    type: 'button',
    to: undefined,
    href: undefined,
  },
)

defineEmits<{ click: [event: MouseEvent] }>()

// Button з PrimeVue вміє рендеритися як інший елемент або компонент (as)
const as = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const linkAttrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href, target: '_blank', rel: 'noopener' }
  return { type: props.type }
})
</script>

<template>
  <Button
    :as="as"
    v-bind="linkAttrs"
    :label="label"
    :icon="icon"
    :severity="severity === 'primary' ? undefined : severity"
    :variant="variant === 'filled' ? undefined : variant"
    :size="size === 'medium' ? undefined : size"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click', $event)"
  />
</template>
