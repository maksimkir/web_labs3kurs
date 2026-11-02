<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useSessionStore } from '@/entities/session'
import { fieldStateProps } from '@/shared/lib'
import { AppButton, AppInput, AppMessage, useAppToast } from '@/shared/ui'
import { loginFormSchema } from '../model/schema'

const emit = defineEmits<{ success: [] }>()

const session = useSessionStore()
const toast = useAppToast()

const { defineField, handleSubmit, isSubmitting } = useForm({ validationSchema: loginFormSchema })
const [username, usernameProps] = defineField('username', fieldStateProps)
const [password, passwordProps] = defineField('password', fieldStateProps)

const error = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  error.value = null
  try {
    // POST /auth/login → токени й дані користувача потрапляють у стор сесії
    await session.login(values)
    emit('success')
  } catch (e) {
    error.value = (e as Error).message
    toast.error('Помилка авторизації', error.value)
  }
})
</script>

<template>
  <form
    class="login-form"
    novalidate
    @submit="onSubmit"
  >
    <AppInput
      v-model="username"
      v-bind="usernameProps"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
    />
    <AppInput
      v-model="password"
      v-bind="passwordProps"
      type="password"
      label="Password"
      placeholder="Enter password"
      autocomplete="current-password"
    />

    <!-- помилка авторизації виводиться у формі -->
    <AppMessage
      v-if="error"
      severity="error"
    >
      {{ error }}
    </AppMessage>

    <AppButton
      type="submit"
      label="Login"
      icon="pi pi-sign-in"
      :loading="isSubmitting"
    />
  </form>
</template>

<style scoped lang="scss">
.login-form {
  display: grid;
  gap: 0.875rem;
}
</style>
