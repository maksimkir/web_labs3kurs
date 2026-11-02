<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { RouteLocationRaw } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/auth'
import { ThemeToggle } from '@/features/theme-toggle'
import { AppButton } from '@/shared/ui'

const items: { label: string; to: RouteLocationRaw }[] = [
  { label: 'Home', to: { name: 'home' } },
  { label: 'About author', to: { name: 'about' } },
  { label: 'Users', to: { name: 'users' } },
]

const { isAuthenticated, user } = storeToRefs(useSessionStore())
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

    <div class="app-navigation__actions">
      <ThemeToggle />
      <template v-if="isAuthenticated">
        <span
          class="app-navigation__user"
          :title="user?.email"
        >
          {{ user?.firstName }} {{ user?.lastName }}
        </span>
        <LogoutButton />
      </template>
      <AppButton
        v-else
        label="Login"
        icon="pi pi-sign-in"
        size="small"
        :to="{ name: 'login' }"
      />
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
  color: var(--p-text-muted-color);
  text-decoration: none;
  border-bottom: 2px solid transparent;

  &:hover {
    color: var(--p-primary-color);
  }

  &--active {
    color: var(--p-primary-color);
    border-bottom-color: var(--p-primary-color);
  }
}

.app-navigation__actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-left: 0.5rem;
}

.app-navigation__user {
  color: var(--p-text-muted-color);
}
</style>
