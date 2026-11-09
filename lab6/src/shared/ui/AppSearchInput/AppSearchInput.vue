<script setup lang="ts">
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'
import { ref, useId, watch } from 'vue'

const DEBOUNCE_MS = 300

const props = withDefaults(
  defineProps<{
    /** Застосований запит (наприклад, з URL). */
    value?: string
    label?: string
    placeholder?: string
  }>(),
  { value: '', label: 'Search', placeholder: 'Search...' },
)

const emit = defineEmits<{ search: [query: string] }>()

const id = useId()
const query = ref(props.value)

// значення з URL (наприклад, після кнопки "Назад" у браузері) потрапляє в поле
watch(
  () => props.value,
  (value) => {
    if (value !== query.value.trim()) query.value = value
  },
)

// debounce 300 мс: подію надсилаємо, коли користувач перестав друкувати
watch(query, (value, _previous, onCleanup) => {
  const timer = setTimeout(() => {
    if (value.trim() !== props.value) emit('search', value.trim())
  }, DEBOUNCE_MS)
  onCleanup(() => clearTimeout(timer))
})
</script>

<template>
  <div class="app-search">
    <label
      class="visually-hidden"
      :for="id"
    >{{ label }}</label>
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText
        :id="id"
        v-model="query"
        type="search"
        :placeholder="placeholder"
        autocomplete="off"
        fluid
      />
    </IconField>
  </div>
</template>

<style scoped lang="scss">
.app-search {
  width: 100%;
  max-width: 20rem;
}
</style>
