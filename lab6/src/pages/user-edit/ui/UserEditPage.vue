<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fullName, useUsersStore, type UpdateUserDto } from '@/entities/user'
import { UserForm, type UserFormValues } from '@/features/user-form'
import { AppButton, useAppToast } from '@/shared/ui'

const props = defineProps<{ id: string }>()

const router = useRouter()
const usersStore = useUsersStore()
const toast = useAppToast()
// користувача вже завантажила батьківська сторінка /users/:id
const { currentUser: user } = storeToRefs(usersStore)
const pending = ref(false)
const error = ref<string | null>(null)

const initialValues = computed(() =>
  user.value
    ? {
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        email: user.value.email,
        username: user.value.username,
        age: user.value.age,
        gender: user.value.gender,
        phone: user.value.phone,
        password: '',
      }
    : undefined,
)

async function save({ password, ...values }: UserFormValues): Promise<void> {
  pending.value = true
  error.value = null
  // порожній пароль не надсилаємо — він лишається без змін
  const data: UpdateUserDto = password ? { ...values, password } : values
  try {
    // PUT /users/:id; стор оновлює користувача в локальному стані
    const updated = await usersStore.updateUser(Number(props.id), data)
    toast.success('Дані оновлено', fullName(updated))
    router.push({ name: 'user', params: { id: props.id } })
  } catch (e) {
    error.value = (e as Error).message
    toast.error('Не вдалося оновити дані', error.value)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <h2 class="user-edit__title">
    Редагувати дані
  </h2>
  <UserForm
    v-if="initialValues"
    :initial-values="initialValues"
    :password-required="false"
    submit-label="Оновити дані"
    :pending="pending"
    :server-error="error"
    @submit="save"
  >
    <template #actions>
      <AppButton
        label="Скасувати"
        severity="secondary"
        variant="outlined"
        :to="{ name: 'user', params: { id } }"
      />
    </template>
  </UserForm>
</template>

<style scoped lang="scss">
.user-edit__title {
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
}
</style>
