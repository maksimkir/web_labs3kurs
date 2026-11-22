<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { fullName, type User } from '@/types/user'
import { formatDate } from '@/utils/format'

// id приходить з URL (/users/:id) як prop завдяки props: true
const props = defineProps<{ id: string }>()

const route = useRoute()
const usersStore = useUsersStore()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const isEditing = computed(() => route.name === 'user-edit')

async function load(): Promise<void> {
  isLoading.value = true
  error.value = null
  user.value = null
  try {
    user.value = await usersStore.getUser(Number(props.id))
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
}

watch(() => props.id, load, { immediate: true })

function onSaved(updated: User): void {
  user.value = updated
}

const details = computed(() => {
  if (!user.value) return []
  const u = user.value
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
    { label: 'Address', value: u.address ? `${u.address.address}, ${u.address.city}, ${u.address.country}` : '—' },
  ]
})
</script>

<template>
  <RouterLink
    :to="{ name: 'users' }"
    class="user-details__back"
  >
    &larr; До списку учасників
  </RouterLink>

  <section class="card">
    <div class="card-body-padded">
      <div
        v-if="isLoading"
        class="request-state"
      >
        <span
          class="spinner-border spinner-border-sm"
          aria-hidden="true"
        />
        Завантаження...
      </div>

      <div
        v-else-if="error"
        class="alert alert-danger mb-0"
        role="alert"
      >
        Не вдалося завантажити учасника: {{ error }}
      </div>

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
          <RouterLink
            v-if="!isEditing"
            :to="{ name: 'user-edit', params: { id: user.id } }"
            class="btn btn-primary ms-auto"
          >
            Редагувати дані
          </RouterLink>
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

        <!-- вкладений маршрут /users/:id/edit отримує завантаженого користувача -->
        <RouterView v-slot="{ Component }">
          <component
            :is="Component"
            v-if="Component"
            :user="user"
            @saved="onSaved"
          />
        </RouterView>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.user-details__back {
  align-self: flex-start;
  color: var(--bs-secondary-color);
  text-decoration: none;

  &:hover {
    color: var(--bs-primary);
  }
}

.user-details__header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.user-details__avatar {
  background: var(--bs-body-bg);
  border-radius: 50%;
}

.user-details__name {
  margin: 0;
  font-size: 1.375rem;
}

.user-details__id {
  margin: 0;
  color: var(--bs-secondary-color);
}

.user-details__list {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1.5rem;
  margin: 0;

  dt {
    font-weight: 600;
    color: var(--lottery-ink);
  }

  dd {
    margin: 0;
    color: var(--bs-secondary-color);
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
