<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import BaseModal from '@/components/BaseModal.vue'
import ParticipantForm from '@/components/ParticipantForm.vue'
import SearchBar from '@/components/SearchBar.vue'
import type {
  Participant,
  ParticipantFormValues,
  SortField,
  SortState,
} from '@/types/participant'
import { formatDate } from '@/utils/format'

const props = defineProps<{ participants: readonly Participant[] }>()

const emit = defineEmits<{
  update: [id: string, values: ParticipantFormValues]
  remove: [id: string]
}>()

const COLUMN_COUNT = 7
const nameCollator = new Intl.Collator(['uk', 'en'], { sensitivity: 'base' })

// ---- Фільтрація та сортування (computed) ----------------------------------

const nameQuery = ref('')
const sort = ref<SortState | null>(null)

// 1) спочатку фільтр...
const filteredParticipants = computed(() => {
  const query = nameQuery.value.trim().toLowerCase()
  if (!query) return props.participants
  return props.participants.filter((p) => p.name.toLowerCase().includes(query))
})

// 2) ...потім сортування копії (вихідний масив не змінюється).
const visibleParticipants = computed(() => {
  if (!sort.value) return filteredParticipants.value
  const { field, direction } = sort.value
  const factor = direction === 'asc' ? 1 : -1

  return [...filteredParticipants.value].sort((a, b) => {
    const result =
      field === 'name'
        ? nameCollator.compare(a.name, b.name)
        : a.birthDate.localeCompare(b.birthDate) // yyyy-mm-dd сортується лексикографічно
    return result * factor
  })
})

const emptyMessage = computed(() =>
  props.participants.length === 0 ? 'No participants yet.' : 'No participants found.',
)

function toggleSort(field: SortField): void {
  // Повторний клік по тому самому контролу змінює напрямок.
  if (sort.value?.field === field) {
    sort.value = { field, direction: sort.value.direction === 'asc' ? 'desc' : 'asc' }
  } else {
    sort.value = { field, direction: 'asc' }
  }
}

function ariaSort(field: SortField): 'ascending' | 'descending' | 'none' {
  if (sort.value?.field !== field) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

const nameSortIcon = computed(() =>
  sort.value?.field === 'name' && sort.value.direction === 'desc'
    ? 'sort-alpha-down-alt'
    : 'sort-alpha-down',
)
const dateSortIcon = computed(() =>
  sort.value?.field === 'birthDate' && sort.value.direction === 'desc'
    ? 'sort-down-alt'
    : 'sort-down',
)

// ---- Модальні вікна: редагування та видалення -----------------------------
// Окремо тримаємо "відкрито" та "обраний учасник", щоб вміст не зникав під час
// CSS-переходу закриття.

const editing = ref<Participant | null>(null)
const isEditOpen = ref(false)
const deleting = ref<Participant | null>(null)
const isDeleteOpen = ref(false)

function openEdit(participant: Participant): void {
  editing.value = participant
  isEditOpen.value = true
}

function submitEdit(values: ParticipantFormValues): void {
  if (editing.value) emit('update', editing.value.id, values)
  isEditOpen.value = false
}

function openDelete(participant: Participant): void {
  deleting.value = participant
  isDeleteOpen.value = true
}

function confirmDelete(): void {
  if (deleting.value) emit('remove', deleting.value.id)
  isDeleteOpen.value = false
}
</script>

<template>
  <section
    class="card"
    aria-labelledby="participants-title"
  >
    <div class="participants-block">
      <div class="participants-block__toolbar">
        <h2
          id="participants-title"
          class="visually-hidden"
        >
          Participants
        </h2>
        <SearchBar @filter-by-name="nameQuery = $event" />
      </div>

      <div class="participants-block__scroll">
        <table class="table participants-table">
          <thead>
            <tr>
              <th
                scope="col"
                class="participants-table__index"
              >
                #
              </th>
              <th
                scope="col"
                :aria-sort="ariaSort('name')"
              >
                <button
                  class="sort-button"
                  :class="{ 'sort-button--active': sort?.field === 'name' }"
                  type="button"
                  @click="toggleSort('name')"
                >
                  Name
                  <BaseIcon :name="nameSortIcon" />
                </button>
              </th>
              <th
                scope="col"
                :aria-sort="ariaSort('birthDate')"
              >
                <button
                  class="sort-button"
                  :class="{ 'sort-button--active': sort?.field === 'birthDate' }"
                  type="button"
                  @click="toggleSort('birthDate')"
                >
                  Date of Birth
                  <BaseIcon :name="dateSortIcon" />
                </button>
              </th>
              <th scope="col">
                Email
              </th>
              <th scope="col">
                Phone number
              </th>
              <th scope="col">
                <span class="visually-hidden">Edit</span>
              </th>
              <th scope="col">
                <span class="visually-hidden">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="visibleParticipants.length > 0">
              <tr
                v-for="(participant, index) in visibleParticipants"
                :key="participant.id"
              >
                <td class="participants-table__index">
                  {{ index + 1 }}
                </td>
                <td>{{ participant.name }}</td>
                <td>{{ formatDate(participant.birthDate) }}</td>
                <td>{{ participant.email }}</td>
                <td>{{ participant.phone }}</td>
                <td>
                  <BaseButton
                    variant="outline-primary"
                    size="sm"
                    @click="openEdit(participant)"
                  >
                    <BaseIcon
                      name="pencil"
                      :size="13"
                    />
                    Редагувати дані
                  </BaseButton>
                </td>
                <td>
                  <BaseButton
                    variant="outline-danger"
                    size="sm"
                    @click="openDelete(participant)"
                  >
                    <BaseIcon
                      name="trash"
                      :size="13"
                    />
                    Видалити учасника
                  </BaseButton>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td
                class="participants-table__empty"
                :colspan="COLUMN_COUNT"
              >
                {{ emptyMessage }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal
      :open="isEditOpen"
      @close="isEditOpen = false"
    >
      <template #header>
        Редагувати дані
      </template>
      <ParticipantForm
        v-if="editing"
        :participants="participants"
        :initial-values="{
          name: editing.name,
          birthDate: editing.birthDate,
          email: editing.email,
          phone: editing.phone,
        }"
        :editing-id="editing.id"
        submit-label="Оновити дані"
        @submit="submitEdit"
      />
    </BaseModal>

    <BaseModal
      :open="isDeleteOpen"
      @close="isDeleteOpen = false"
    >
      <template #header>
        Видалення учасника
      </template>
      <p
        v-if="deleting"
        class="mb-0"
      >
        Ви дійсно бажаєте видалити учасника "{{ deleting.name }}", "{{ deleting.email }}"?
      </p>
      <template #footer>
        <BaseButton
          variant="danger"
          @click="confirmDelete"
        >
          Так
        </BaseButton>
        <BaseButton
          variant="secondary"
          @click="isDeleteOpen = false"
        >
          Ні
        </BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<style scoped lang="scss">
.participants-block {
  padding: 1rem 1.25rem 0.75rem;
}

.participants-block__toolbar {
  margin-bottom: 0.75rem;
}

.participants-block__scroll {
  // relative — щоб приховані підписи (.visually-hidden, position: absolute) обрізались
  // контейнером і не розтягували сторінку по горизонталі.
  position: relative;
  overflow-x: auto;
}

.participants-table {
  margin-bottom: 0;
  font-size: 0.875rem;
  white-space: nowrap;

  th {
    font-weight: 700;
    color: var(--lottery-ink);
    vertical-align: middle;
  }

  td {
    color: var(--bs-secondary-color);
    vertical-align: middle;
  }

  th,
  td {
    padding: 0.625rem 0.5rem;
  }

  .btn-sm {
    --bs-btn-padding-x: 0.5rem;
    --bs-btn-font-size: 0.75rem;
  }
}

.participants-table__index {
  width: 2.5rem;
  color: var(--bs-secondary-color);
}

th.participants-table__index {
  font-weight: 700;
  color: var(--bs-secondary-color);
}

.participants-table__empty {
  padding: 1.5rem 0.75rem;
  text-align: center;
}

.sort-button {
  display: inline-flex;
  gap: 0.375rem;
  align-items: center;
  padding: 0;
  font: inherit;
  font-weight: 700;
  color: inherit;
  cursor: pointer;
  background: none;
  border: 0;

  &:hover,
  &--active {
    color: var(--bs-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--bs-primary);
    outline-offset: 3px;
  }
}
</style>
