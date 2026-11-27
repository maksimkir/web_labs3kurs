<script setup lang="ts">
import InputText from 'primevue/inputtext'
import { computed, useId } from 'vue'

// атрибути (placeholder, autocomplete, onBlur від VeeValidate) потрапляють на саме поле
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'number'
    /** Текст помилки валідації; поле підсвічується червоним. */
    error?: string
    valid?: boolean
  }>(),
  { type: 'text', error: '', valid: false },
)

const model = defineModel<string | number | undefined>()

const id = useId()
const errorId = `${id}-error`
const hasError = computed(() => Boolean(props.error))
const text = computed(() => (model.value === undefined ? '' : String(model.value)))
</script>

<template>
  <div class="app-field">
    <label
      class="app-field__label"
      :for="id"
    >{{ label }}</label>
    <InputText
      v-bind="$attrs"
      :id="id"
      :model-value="text"
      :type="type"
      :invalid="hasError"
      :class="{ 'app-field__input--valid': valid && !hasError }"
      :aria-describedby="hasError ? errorId : undefined"
      fluid
      @update:model-value="model = $event ?? ''"
    />
    <small
      v-if="hasError"
      :id="errorId"
      class="app-field__error"
    >{{ error }}</small>
  </div>
</template>
