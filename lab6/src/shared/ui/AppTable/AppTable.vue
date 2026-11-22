<script setup lang="ts" generic="T extends { id: number | string }">
import Column from 'primevue/column'
import DataTable, { type DataTableSortEvent } from 'primevue/datatable'
import type { AppTableColumn, AppTableSortOrder } from './types'

withDefaults(
  defineProps<{
    rows: readonly T[]
    columns: readonly AppTableColumn[]
    loading?: boolean
    sortField?: string
    sortOrder?: AppTableSortOrder
    emptyMessage?: string
  }>(),
  { loading: false, sortField: undefined, sortOrder: 'asc', emptyMessage: 'No records found.' },
)

const emit = defineEmits<{ sort: [field: string, order: AppTableSortOrder] }>()

// вміст комірки можна перевизначити слотом #cell-<field>
defineSlots<Record<`cell-${string}`, (props: { row: T; index: number }) => unknown>>()

// сортування серверне (lazy): таблиця лише повідомляє, що обрав користувач
function onSort(event: DataTableSortEvent): void {
  if (typeof event.sortField === 'string') {
    emit('sort', event.sortField, event.sortOrder === -1 ? 'desc' : 'asc')
  }
}
</script>

<template>
  <DataTable
    :value="[...rows]"
    data-key="id"
    lazy
    :loading="loading"
    :sort-field="sortField"
    :sort-order="sortOrder === 'desc' ? -1 : 1"
    scrollable
    size="small"
    @sort="onSort"
  >
    <Column
      v-for="column in columns"
      :key="column.field"
      :field="column.field"
      :header="column.header"
      :sortable="column.sortable"
      :header-style="column.style"
    >
      <template #body="{ data, index }">
        <slot
          :name="`cell-${column.field}`"
          :row="data as T"
          :index="index"
        >
          {{ (data as Record<string, unknown>)[column.field] }}
        </slot>
      </template>
    </Column>
    <template #empty>
      <p class="app-table__empty">
        {{ emptyMessage }}
      </p>
    </template>
  </DataTable>
</template>

<style scoped lang="scss">
.app-table__empty {
  padding: 1rem 0;
  margin: 0;
  color: var(--p-text-muted-color);
  text-align: center;
}
</style>
