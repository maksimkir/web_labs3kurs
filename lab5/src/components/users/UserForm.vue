<script setup lang="ts">
import { useForm } from 'vee-validate'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import type { Gender } from '@/types/user'
import { userFormSchema, type UserFormValues } from '@/validation/schemas'

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
    /** Помилка від сервера (виводиться у формі, без alert). */
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

// VeeValidate + zod: правила валідації описані схемою, форма лише відображає помилки.
const { defineField, handleSubmit, resetForm } = useForm({
  validationSchema: userFormSchema(props.passwordRequired),
  initialValues: props.initialValues,
})

// помилка показується, коли поле "торкнуте" (blur) або після спроби відправки
const fieldProps = {
  props: (state: { touched: boolean; valid: boolean; errors: string[] }) => ({
    error: state.touched ? state.errors[0] : undefined,
    valid: state.touched && state.valid,
  }),
}

const [firstName, firstNameProps] = defineField('firstName', fieldProps)
const [lastName, lastNameProps] = defineField('lastName', fieldProps)
const [email, emailProps] = defineField('email', fieldProps)
const [username, usernameProps] = defineField('username', fieldProps)
const [password, passwordProps] = defineField('password', fieldProps)
const [age, ageProps] = defineField('age', fieldProps)
const [gender, genderProps] = defineField('gender', fieldProps)
const [phone, phoneProps] = defineField('phone', fieldProps)

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
      <BaseInput
        v-model="firstName"
        v-bind="firstNameProps"
        label="First name"
        placeholder="Enter first name"
        autocomplete="given-name"
      />
      <BaseInput
        v-model="lastName"
        v-bind="lastNameProps"
        label="Last name"
        placeholder="Enter last name"
        autocomplete="family-name"
      />
      <BaseInput
        v-model="email"
        v-bind="emailProps"
        type="email"
        label="Email"
        placeholder="Enter email"
        autocomplete="off"
      />
      <BaseInput
        v-model="username"
        v-bind="usernameProps"
        label="Username"
        placeholder="Enter username"
        autocomplete="off"
      />
      <BaseInput
        v-model="password"
        v-bind="passwordProps"
        type="password"
        label="Password"
        :placeholder="passwordRequired ? 'Enter password' : 'Залиште порожнім, щоб не змінювати'"
        autocomplete="new-password"
      />
      <BaseInput
        v-model="age"
        v-bind="ageProps"
        type="number"
        label="Age"
        placeholder="Enter age"
        min="1"
        max="120"
      />
      <BaseSelect
        v-model="gender"
        v-bind="genderProps"
        label="Gender"
        :options="GENDER_OPTIONS"
        placeholder="Select gender"
      />
      <BaseInput
        v-model="phone"
        v-bind="phoneProps"
        type="tel"
        label="Phone number"
        placeholder="+380 50 123 4567"
        autocomplete="off"
      />
    </div>

    <p
      v-if="serverError"
      class="alert alert-danger mb-0"
      role="alert"
    >
      {{ serverError }}
    </p>

    <div class="user-form__actions">
      <slot name="actions" />
      <BaseButton
        type="submit"
        :disabled="pending"
      >
        <span
          v-if="pending"
          class="spinner-border spinner-border-sm"
          aria-hidden="true"
        />
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  column-gap: 1rem;
}

.user-form__actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1.25rem;
}
</style>
