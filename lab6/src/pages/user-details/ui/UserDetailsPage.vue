<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fullName, useUsersStore } from '@/entities/user'
import { formatDate } from '@/shared/lib'
import { AppButton, AppCard, AppMessage, AppSpinner } from '@/shared/ui'

// id приходить з URL (/users/:id) як prop завдяки props: true
const props = defineProps<{ id: string }>()

const route = useRoute()
const usersStore = useUsersStore()
// storeToRefs зберігає реактивність state і getters при деструктуризації
const { currentUser: user, isUserLoading: isLoading, userError: error } = storeToRefs(usersStore)

const isEditing = computed(() => route.name === 'user-edit')

watch(
  () => props.id,
  (id) => usersStore.fetchUser(Number(id)),
  { immediate: true },
)

const details = computed(() => {
  const u = user.value
  if (!u) return []
  return [
    { label: 'Username', value: u.username },
    { label: 'Email', value: u.email },
    { label: 'Phone number', value: u.phone },
    { label: 'Age', value: String(u.age) },
    { label: 'Gender', value: u.gender },
    { label: 'Date of Birth', value: u.birthDate ? formatDate(u.birthDate) : '—' },
    { label: 'Role', value: u.role ?? '—' },
    { label: 'University', value: u.university ?? '—' },
    { label: 'Company', value: u.company ? `${u.company.title}, ${u.company.name}` : '—' },
    {
      label: 'Address',
      value: u.address ? `${u.address.address}, ${u.address.city}, ${u.address.country}` : '—',
    },
  ]
})
</script>

<template>
  <RouterLink
    :to="{ name: 'users' }"
    class="user-details__back"
  >
    <i
      class="pi pi-arrow-left"
      aria-hidden="true"
    /> До списку учасників
  </RouterLink>

  <AppCard>
    <AppSpinner v-if="isLoading" />

    <AppMessage
      v-else-if="error"
      severity="error"
    >
      Не вдалося завантажити учасника: {{ error }}
    </AppMessage>

    <template v-else-if="user">
      <div class="user-details__header">
        <img
          v-if="user.image"
          :src="user.image"
          :alt="fullName(user)"
          class="user-details__avatar"
          width="72"
          height="72"
        >
        <div>
          <h1 class="user-details__name">
            {{ fullName(user) }}
          </h1>
          <p class="user-details__id">
            ID: {{ user.id }}
          </p>
        </div>
        <AppButton
          v-if="!isEditing"
          class="user-details__edit"
          label="Редагувати дані"
          icon="pi pi-pencil"
          :to="{ name: 'user-edit', params: { id: user.id } }"
        />
      </div>

      <dl
        v-if="!isEditing"
        class="user-details__list"
      >
        <template
          v-for="item in details"
          :key="item.label"
        >
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </template>
      </dl>

      <!-- вкладений маршрут /users/:id/edit бере користувача зі стору -->
      <RouterView />
    </template>
  </AppCard>
</template>

<style scoped lang="scss">
.user-details__back {
  align-self: flex-start;
  color: var(--p-text-muted-color);
  text-decoration: none;

  &:hover {
    color: var(--p-primary-color);
  }
}

.user-details__header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.user-details__edit {
  margin-left: auto;
}

.user-details__avatar {
  background: var(--p-content-hover-background);
  border-radius: 50%;
}

.user-details__name {
  margin: 0;
  font-size: 1.375rem;
}

.user-details__id {
  margin: 0;
  color: var(--p-text-muted-color);
}

.user-details__list {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1.5rem;
  margin: 0;

  dt {
    font-weight: 600;
  }

  dd {
    margin: 0;
    color: var(--p-text-muted-color);
  }
}

@media (max-width: 575.98px) {
  .user-details__list {
    grid-template-columns: 1fr;

    dd {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
