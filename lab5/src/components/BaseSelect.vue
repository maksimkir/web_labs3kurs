<script setup lang="ts">
import { computed, useId } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label: string
    options: readonly { value: string; label: string }[]
    placeholder?: string
    error?: string
    valid?: boolean
  }>(),
  { placeholder: 'Оберіть...', error: '', valid: false },
)

const model = defineModel<string | undefined>()

const id = useId()
const errorId = computed(() => `${id}-error`)
const hasError = computed(() => Boolean(props.error))
</script>

<template>
  <div class="base-select">
    <label
      class="form-label"
      :for="id"
    >{{ label }}</label>
    <select
      v-bind="$attrs"
      :id="id"
      v-model="model"
      class="form-select"
      :class="{
        'is-invalid': hasError,
        'is-valid': valid && !hasError,
        'is-empty': !model,
      }"
      :aria-invalid="hasError ? 'true' : undefined"
      :aria-describedby="hasError ? errorId : undefined"
    >
      <option
        :value="undefined"
        disabled
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p
      v-if="hasError"
      :id="errorId"
      class="base-select__error"
    >
      {{ error }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.base-select {
  margin-bottom: 0.875rem;
}

.form-select.is-empty {
  color: var(--bs-secondary-color);
}

.base-select__error {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: var(--bs-danger);
}
</style>
