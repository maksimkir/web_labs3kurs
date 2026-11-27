<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{ change: [page: number] }>()

/** Скільки сторінок показувати ліворуч і праворуч від поточної. */
const SIBLINGS = 2

const pages = computed(() => {
  const from = Math.max(1, props.page - SIBLINGS)
  const to = Math.min(props.totalPages, props.page + SIBLINGS)
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
})

function go(page: number): void {
  if (page >= 1 && page <= props.totalPages && page !== props.page) emit('change', page)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    aria-label="Сторінки списку"
  >
    <ul class="pagination pagination-sm mb-0">
      <li
        class="page-item"
        :class="{ disabled: page <= 1 }"
      >
        <button
          class="page-link"
          type="button"
          aria-label="Попередня сторінка"
          :disabled="page <= 1"
          @click="go(page - 1)"
        >
          &laquo;
        </button>
      </li>
      <li
        v-for="item in pages"
        :key="item"
        class="page-item"
        :class="{ active: item === page }"
      >
        <button
          class="page-link"
          type="button"
          :aria-current="item === page ? 'page' : undefined"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </li>
      <li
        class="page-item"
        :class="{ disabled: page >= totalPages }"
      >
        <button
          class="page-link"
          type="button"
          aria-label="Наступна сторінка"
          :disabled="page >= totalPages"
          @click="go(page + 1)"
        >
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>
