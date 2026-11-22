<script setup lang="ts">
import { useForm } from 'vee-validate'
import type { Gender } from '@/entities/user'
import { fieldStateProps } from '@/shared/lib'
import { AppButton, AppInput, AppMessage, AppSelect } from '@/shared/ui'
import { userFormSchema, type UserFormValues } from '../model/schema'

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const satisfies readonly { value: Gender; label: string }[]

const props = withDefaults(
  defineProps<{
    initialValues?: Partial<UserFormValues>
    /** При створенні пароль обов'язковий, при редагуванні — ні. */
    passwordRequired?: boolean
    submitLabel?: string
    pending?: boolean
    /** Помилка від сервера (виводиться у формі). */
    serverError?: string | null
  }>(),
  {
    initialValues: () => ({}),
    passwordRequired: true,
    submitLabel: 'Save',
    pending: false,
    serverError: null,
  },
)

const emit = defineEmits<{ submit: [values: UserFormValues] }>()

// VeeValidate + zod: правила описані схемою, AppInput лише показує помилку
const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: userFormSchema(props.passwordRequired),
  initialValues: props.initialValues,
})

const [firstName, firstNameProps] = defineField('firstName', fieldStateProps)
const [lastName, lastNameProps] = defineField('lastName', fieldStateProps)
const [email, emailProps] = defineField('email', fieldStateProps)
const [username, usernameProps] = defineField('username', fieldStateProps)
const [password, passwordProps] = defineField('password', fieldStateProps)
const [age, ageProps] = defineField('age', fieldStateProps)
const [gender, genderProps] = defineField('gender', fieldStateProps)
const [phone, phoneProps] = defineField('phone', fieldStateProps)

const onSubmit = handleSubmit((values) => emit('submit', values))

defineExpose({ resetForm })
</script>

<template>
  <form
    class="user-form"
    novalidate
    @submit="onSubmit"
  >
    <div class="user-form__grid">
      <AppInput
        v-model="firstName"
        v-bind="firstNameProps"
        label="First name"
        placeholder="Enter first name"
        autocomplete="given-name"
      />
      <AppInput
        v-model="lastName"
        v-bind="lastNameProps"
        label="Last name"
        placeholder="Enter last name"
        autocomplete="family-name"
      />
      <AppInput
        v-model="email"
        v-bind="emailProps"
        type="email"
        label="Email"
        placeholder="Enter email"
        autocomplete="off"
      />
      <AppInput
        v-model="username"
        v-bind="usernameProps"
        label="Username"
        placeholder="Enter username"
        autocomplete="off"
      />
      <AppInput
        v-model="password"
        v-bind="passwordProps"
        type="password"
        label="Password"
        :placeholder="passwordRequired ? 'Enter password' : 'Залиште порожнім, щоб не змінювати'"
        autocomplete="new-password"
      />
      <AppInput
        v-model="age"
        v-bind="ageProps"
        type="number"
        label="Age"
        placeholder="Enter age"
        min="1"
        max="120"
      />
      <AppSelect
        v-model="gender"
        v-bind="genderProps"
        label="Gender"
        :options="GENDER_OPTIONS"
        placeholder="Select gender"
      />
      <AppInput
        v-model="phone"
        v-bind="phoneProps"
        type="tel"
        label="Phone number"
        placeholder="+380 50 123 4567"
        autocomplete="off"
      />
    </div>

    <AppMessage
      v-if="serverError"
      severity="error"
    >
      {{ serverError }}
    </AppMessage>

    <div class="user-form__actions">
      <slot name="actions" />
      <AppButton
        type="submit"
        :label="submitLabel"
        icon="pi pi-check"
        :loading="pending"
      />
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form {
  display: grid;
  gap: 1rem;
}

.user-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 0.875rem 1rem;
}

.user-form__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
