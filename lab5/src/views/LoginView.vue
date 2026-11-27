<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import { safeRedirect } from '@/router/guards'
import { useAuthStore } from '@/stores/auth'
import { loginFormSchema } from '@/validation/schemas'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const { defineField, handleSubmit, isSubmitting } = useForm({ validationSchema: loginFormSchema })

const fieldProps = {
  props: (state: { touched: boolean; errors: string[] }) => ({
    error: state.touched ? state.errors[0] : undefined,
  }),
}
const [username, usernameProps] = defineField('username', fieldProps)
const [password, passwordProps] = defineField('password', fieldProps)

const error = ref<string | null>(null)

const onSubmit = handleSubmit(async (values) => {
  error.value = null
  try {
    // POST /auth/login → accessToken, refreshToken і дані користувача потрапляють у стор
    await auth.login(values)
    // після входу повертаємося на сторінку, яку користувач запитував (?redirect=)
    await router.replace(safeRedirect(route.query.redirect) ?? { name: 'users' })
  } catch (e) {
    error.value = (e as Error).message
  }
})
</script>

<template>
  <section class="card">
    <div class="card-body-padded">
      <h1 class="section-title">
        Login
      </h1>
      <p
        v-if="route.query.redirect"
        class="login-view__hint"
      >
        Увійдіть, щоб переглянути цю сторінку.
      </p>

      <form
        novalidate
        @submit="onSubmit"
      >
        <BaseInput
          v-model="username"
          v-bind="usernameProps"
          label="Username"
          placeholder="Enter username"
          autocomplete="username"
        />
        <BaseInput
          v-model="password"
          v-bind="passwordProps"
          type="password"
          label="Password"
          placeholder="Enter password"
          autocomplete="current-password"
        />

        <!-- помилка авторизації виводиться у формі -->
        <p
          v-if="error"
          class="alert alert-danger py-2"
          role="alert"
        >
          {{ error }}
        </p>

        <BaseButton
          type="submit"
          class="w-100"
          :disabled="isSubmitting"
        >
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm"
            aria-hidden="true"
          />
          Login
        </BaseButton>
      </form>

      <p class="login-view__credentials">
        Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.login-view__hint {
  margin: -0.25rem 0 1rem;
  color: var(--bs-secondary-color);
}

.login-view__credentials {
  margin: 1rem 0 0;
  font-size: 0.75rem;
  color: var(--bs-secondary-color);
  text-align: center;
}
</style>
