<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserForm from '@/components/users/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { UpdateUserDto, User } from '@/types/user'
import type { UserFormValues } from '@/validation/schemas'

const props = defineProps<{
  id: string
  /** Користувач, якого вже завантажила батьківська сторінка /users/:id. */
  user: User
}>()

const emit = defineEmits<{ saved: [user: User] }>()

const router = useRouter()
const usersStore = useUsersStore()
const pending = ref(false)
const error = ref<string | null>(null)

const initialValues = {
  firstName: props.user.firstName,
  lastName: props.user.lastName,
  email: props.user.email,
  username: props.user.username,
  age: props.user.age,
  gender: props.user.gender,
  phone: props.user.phone,
  password: '',
}

async function save({ password, ...values }: UserFormValues): Promise<void> {
  pending.value = true
  error.value = null
  // порожній пароль не надсилаємо — він лишається без змін
  const data: UpdateUserDto = password ? { ...values, password } : values
  try {
    // PUT /users/:id; оновлений користувач замінює старого в локальному стані
    const user = await usersStore.updateUser(Number(props.id), data)
    emit('saved', user)
    router.push({ name: 'user', params: { id: props.id } })
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <h2 class="section-title">
    Редагувати дані
  </h2>
  <UserForm
    :initial-values="initialValues"
    :password-required="false"
    submit-label="Оновити дані"
    :pending="pending"
    :server-error="error"
    @submit="save"
  >
    <template #actions>
      <RouterLink
        :to="{ name: 'user', params: { id } }"
        class="btn btn-secondary"
      >
        Скасувати
      </RouterLink>
    </template>
  </UserForm>
</template>
