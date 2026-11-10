<script setup lang="ts">
import Select from 'primevue/select'
import { computed, useAttrs, useId } from 'vue'

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

// VeeValidate передає onBlur, щоб позначити поле "торкнутим"
const attrs = useAttrs()
function onBlur(event: Event): void {
  const handler = attrs.onBlur as ((event: Event) => void) | undefined
  handler?.(event)
}

const id = useId()
const errorId = `${id}-error`
const hasError = computed(() => Boolean(props.error))
</script>

<template>
  <div class="app-field">
    <label
      :id="`${id}-label`"
      class="app-field__label"
    >{{ label }}</label>
    <Select
      v-model="model"
      :options="[...options]"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :invalid="hasError"
      :class="{ 'app-field__input--valid': valid && !hasError }"
      :aria-labelledby="`${id}-label`"
      :aria-describedby="hasError ? errorId : undefined"
      fluid
      @blur="onBlur"
    />
    <small
      v-if="hasError"
      :id="errorId"
      class="app-field__error"
    >{{ error }}</small>
  </div>
</template>
