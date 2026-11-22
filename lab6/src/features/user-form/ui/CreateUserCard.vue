<script setup lang="ts">
import { ref } from 'vue'
import { fullName, useUsersStore } from '@/entities/user'
import { AppCard, useAppToast } from '@/shared/ui'
import type { UserFormValues } from '../model/schema'
import UserForm from './UserForm.vue'

const usersStore = useUsersStore()
const toast = useAppToast()
const form = ref<InstanceType<typeof UserForm> | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)

async function create(values: UserFormValues): Promise<void> {
  pending.value = true
  error.value = null
  try {
    // POST /users/add; стор додає нового користувача в локальний стан
    const user = await usersStore.createUser({ ...values, password: values.password ?? '' })
    form.value?.resetForm()
    toast.success('Користувача створено', fullName(user))
  } catch (e) {
    error.value = (e as Error).message
    toast.error('Не вдалося створити користувача', error.value)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <AppCard title="Register form">
    <p class="create-user__subtitle">
      Please fill in all the fields.
    </p>
    <UserForm
      ref="form"
      submit-label="Save"
      :pending="pending"
      :server-error="error"
      @submit="create"
    />
  </AppCard>
</template>

<style scoped lang="scss">
.create-user__subtitle {
  margin: -0.5rem 0 1rem;
  color: var(--p-text-muted-color);
}
</style>
