<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { LoginForm } from '@/features/auth'
import { safeRedirect } from '@/shared/lib'
import { AppCard } from '@/shared/ui'

const route = useRoute()
const router = useRouter()

// після входу повертаємося на сторінку, яку користувач запитував (?redirect=)
function onLoggedIn(): void {
  router.replace(safeRedirect(route.query.redirect) ?? { name: 'users' })
}
</script>

<template>
  <AppCard title="Login">
    <p
      v-if="route.query.redirect"
      class="login-page__hint"
    >
      Увійдіть, щоб переглянути цю сторінку.
    </p>
    <LoginForm @success="onLoggedIn" />
    <p class="login-page__credentials">
      Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
    </p>
  </AppCard>
</template>

<style scoped lang="scss">
.login-page__hint {
  margin: -0.25rem 0 1rem;
  color: var(--p-text-muted-color);
}

.login-page__credentials {
  margin: 1rem 0 0;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  text-align: center;
}
</style>
