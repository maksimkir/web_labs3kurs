<script setup lang="ts">
import Paginator, { type PageState } from 'primevue/paginator'
import { computed } from 'vue'

const props = defineProps<{
  /** Поточна сторінка, починаючи з 1. */
  page: number
  rows: number
  totalRecords: number
}>()

const emit = defineEmits<{ change: [page: number] }>()

const first = computed(() => (props.page - 1) * props.rows)

function onPage(state: PageState): void {
  emit('change', state.page + 1)
}
</script>

<template>
  <Paginator
    v-if="totalRecords > rows"
    :first="first"
    :rows="rows"
    :total-records="totalRecords"
    :page-link-size="5"
    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
    @page="onPage"
  />
</template>
