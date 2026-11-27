<script setup lang="ts">
import { ref } from 'vue'
import UserForm from '@/components/users/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { CreateUserDto } from '@/types/user'
import type { UserFormValues } from '@/validation/schemas'

const emit = defineEmits<{ created: [name: string] }>()

const usersStore = useUsersStore()
const form = ref<InstanceType<typeof UserForm> | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)

async function create(values: UserFormValues): Promise<void> {
  pending.value = true
  error.value = null
  try {
    // POST /users/add; новий користувач додається в локальний стан стору
    const user = await usersStore.createUser({ ...values, password: values.password ?? '' } satisfies CreateUserDto)
    form.value?.resetForm()
    emit('created', `${user.firstName} ${user.lastName}`)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <section
    class="card"
    aria-labelledby="register-title"
  >
    <div class="card-body-padded">
      <h2
        id="register-title"
        class="section-title mb-0"
      >
        Register form
      </h2>
      <p class="register-block__subtitle">
        Please fill in all the fields.
      </p>
      <UserForm
        ref="form"
        submit-label="Save"
        :pending="pending"
        :server-error="error"
        @submit="create"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.register-block__subtitle {
  margin: 0.125rem 0 1.25rem;
  color: var(--bs-secondary-color);
}
</style>
