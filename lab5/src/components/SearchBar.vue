<script setup lang="ts">
import { ref, useId, watch } from 'vue'

const DEBOUNCE_MS = 300

const props = withDefaults(defineProps<{ value?: string }>(), { value: '' })
const emit = defineEmits<{ 'filter-by-name': [name: string] }>()

const inputId = useId()
const query = ref(props.value)

// значення з URL (наприклад, після кнопки "Назад" у браузері) потрапляє в поле
watch(
  () => props.value,
  (value) => {
    if (value !== query.value.trim()) query.value = value
  },
)

// watch із затримкою (debounce) 300 мс: подію надсилаємо, коли користувач зупинився.
watch(query, (value, _previous, onCleanup) => {
  const timerId = setTimeout(() => {
    if (value.trim() !== props.value) emit('filter-by-name', value.trim())
  }, DEBOUNCE_MS)
  onCleanup(() => clearTimeout(timerId))
})
</script>

<template>
  <div class="search-bar">
    <label
      class="visually-hidden"
      :for="inputId"
    >Search participants by name</label>
    <input
      :id="inputId"
      v-model="query"
      class="form-control"
      type="search"
      placeholder="Search by name"
      autocomplete="off"
    >
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  max-width: 20rem;
}
</style>
