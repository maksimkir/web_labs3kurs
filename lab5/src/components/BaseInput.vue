<script setup lang="ts">
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'text' | 'email' | 'tel' | 'date' | 'password' | 'number'
    error?: string
    valid?: boolean
  }>(),
  { type: 'text', error: '', valid: false },
)

// Двостороннє зв'язування v-model на власному компоненті.
// Для type="number" Vue сам приводить значення до числа.
const model = defineModel<string | number | undefined>()

const id = useId()
const errorId = computed(() => `${id}-error`)
const hasError = computed(() => Boolean(props.error))
</script>

<template>
  <div class="base-input">
    <label
      class="form-label"
      :for="id"
    >{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      v-model="model"
      class="form-control"
      :class="{
        'is-invalid': hasError,
        'is-valid': valid && !hasError,
      }"
      :type="type"
      :aria-invalid="hasError ? 'true' : undefined"
      :aria-describedby="hasError ? errorId : undefined"
    >
    <p
      v-if="hasError"
      :id="errorId"
      class="base-input__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  margin-bottom: 0.875rem;
}

.form-control {
  // Червоний стан без іконки (як у дизайні): повідомлення виводиться під полем.
  &.is-invalid {
    padding-right: var(--bs-form-control-padding-x, 0.75rem);
    background-image: none;
  }
}

.base-input__error {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--bs-danger);
}
</style>
