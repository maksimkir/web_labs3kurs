<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const items: { label: string; to: RouteLocationRaw }[] = [
  { label: 'Home', to: { name: 'home' } },
  { label: 'About author', to: { name: 'about' } },
  { label: 'Users', to: { name: 'users' } },
]

const router = useRouter()
const auth = useAuthStore()

function logout(): void {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav
    class="app-navigation"
    aria-label="Розділи застосунку"
  >
    <!-- active-class: пункт Users підсвічується й на вкладених сторінках (/users/5/edit) -->
    <RouterLink
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      class="app-navigation__link"
      active-class="app-navigation__link--active"
    >
      {{ item.label }}
    </RouterLink>

    <div class="app-navigation__auth">
      <template v-if="auth.isAuthenticated">
        <span
          class="app-navigation__user"
          :title="auth.user?.email"
        >
          {{ auth.user?.firstName }} {{ auth.user?.lastName }}
        </span>
        <BaseButton
          variant="outline-primary"
          size="sm"
          @click="logout"
        >
          Logout
        </BaseButton>
      </template>
      <RouterLink
        v-else
        :to="{ name: 'login' }"
        class="btn btn-primary btn-sm"
        active-class="app-navigation__login--active"
      >
        Login
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.app-navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  align-items: center;
}

.app-navigation__link {
  padding: 0.375rem 0.75rem;
  font-weight: 600;
  color: var(--bs-secondary-color);
  text-decoration: none;
  border-bottom: 2px solid transparent;

  &:hover {
    color: var(--bs-primary);
  }

  &--active {
    color: var(--bs-primary);
    border-bottom-color: var(--bs-primary);
  }
}

.app-navigation__auth {
  display: flex;
  gap: 0.625rem;
  align-items: center;
  margin-left: 0.75rem;
}

.app-navigation__user {
  color: var(--bs-secondary-color);
}

.app-navigation__login--active {
  box-shadow: 0 0 0 2px rgb(0 163 220 / 30%);
}
</style>
