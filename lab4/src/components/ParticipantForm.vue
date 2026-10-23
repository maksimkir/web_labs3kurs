<script setup lang="ts">
import { computed, reactive } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import type {
  Participant,
  ParticipantField,
  ParticipantFormValues,
} from '@/types/participant'
import { validateParticipant } from '@/utils/validation'

const FIELDS: readonly ParticipantField[] = ['name', 'birthDate', 'email', 'phone']

const props = withDefaults(
  defineProps<{
    /** Усі учасники — потрібні для перевірки унікальності e-mail. */
    participants: readonly Participant[]
    initialValues?: ParticipantFormValues
    /** Id учасника, якого редагуємо (його власний e-mail не вважається дублікатом). */
    editingId?: string
    submitLabel?: string
    resetOnSubmit?: boolean
  }>(),
  {
    initialValues: () => ({ name: '', birthDate: '', email: '', phone: '' }),
    editingId: undefined,
    submitLabel: 'Save',
    resetOnSubmit: false,
  },
)

const emit = defineEmits<{ submit: [values: ParticipantFormValues] }>()

function createEmptyValues(): ParticipantFormValues {
  return { name: '', birthDate: '', email: '', phone: '' }
}

function createFlags(): Record<ParticipantField, boolean> {
  return { name: false, birthDate: false, email: false, phone: false }
}

const values = reactive<ParticipantFormValues>({ ...props.initialValues })
// touched — поле "перевірене" (показуємо помилку); dirty — користувач його змінював.
const touched = reactive(createFlags())
const dirty = reactive(createFlags())

const errors = computed(() => validateParticipant(values, props.participants, props.editingId))

// Помилка показується лише для "торкнутого" поля — тому порожня форма після
// очищення не підсвічується червоним.
function errorFor(field: ParticipantField): string {
  return touched[field] ? (errors.value[field] ?? '') : ''
}

function isValid(field: ParticipantField): boolean {
  return touched[field] && errors.value[field] === undefined
}

function touch(field: ParticipantField): void {
  touched[field] = true
}

function markDirty(field: ParticipantField): void {
  dirty[field] = true
}

// На blur перевіряємо лише змінені поля: після очищення форми порожнє поле, яке
// просто втратило фокус, не підсвічується помилкою.
function onBlur(field: ParticipantField): void {
  if (dirty[field]) touch(field)
}

function resetForm(): void {
  Object.assign(values, createEmptyValues())
  Object.assign(touched, createFlags())
  Object.assign(dirty, createFlags())
}

function onSubmit(): void {
  FIELDS.forEach(touch)
  if (Object.keys(errors.value).length > 0) return

  emit('submit', {
    name: values.name.trim(),
    birthDate: values.birthDate,
    email: values.email.trim(),
    phone: values.phone.trim(),
  })

  if (props.resetOnSubmit) resetForm()
}
</script>

<template>
  <!-- Enter відправляє форму: ключовий модифікатор .enter (+ .prevent, щоб не було подвійної відправки) -->
  <form
    novalidate
    @submit.prevent="onSubmit"
    @keydown.enter.prevent="onSubmit"
  >
    <BaseInput
      v-model="values.name"
      label="Name"
      placeholder="Enter user name"
      autocomplete="off"
      :error="errorFor('name')"
      :valid="isValid('name')"
      @blur="onBlur('name')"
      @input="markDirty('name')"
    />
    <BaseInput
      v-model="values.birthDate"
      type="date"
      label="Date of Birth"
      :error="errorFor('birthDate')"
      :valid="isValid('birthDate')"
      @blur="onBlur('birthDate')"
      @input="markDirty('birthDate')"
    />
    <BaseInput
      v-model="values.email"
      type="email"
      label="Email"
      placeholder="Enter email"
      autocomplete="off"
      :error="errorFor('email')"
      :valid="isValid('email')"
      @blur="onBlur('email')"
      @input="markDirty('email')"
    />
    <BaseInput
      v-model="values.phone"
      type="tel"
      label="Phone number"
      placeholder="Enter Phone number"
      autocomplete="off"
      :error="errorFor('phone')"
      :valid="isValid('phone')"
      @blur="onBlur('phone')"
      @input="markDirty('phone')"
    />

    <div class="participant-form__actions">
      <BaseButton type="submit">
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.participant-form__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.75rem;
}
</style>
