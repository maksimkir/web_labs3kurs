<script setup lang="ts">
import { computed, ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import type { User } from '@/types/user'
import { getAgeGroup } from '@/utils/ageGroup'
import { capitalize, formatDob } from '@/utils/format'
import { getHobbyTone } from '@/utils/hobbies'

const props = defineProps<{ user: User }>()

const isDetailsOpen = ref(false)

const age = computed(() => props.user.dob.age)
const ageGroup = computed(() => getAgeGroup(age.value))

const fullName = computed(() => `${props.user.name.first} ${props.user.name.last}`)
const displayName = computed(() => `${props.user.name.title}. ${fullName.value}`)
const shortLocation = computed(() => {
  const { city, state, country } = props.user.location
  return `${city}, ${state}, ${country}`
})
const street = computed(() => `${props.user.location.street.number} ${props.user.location.street.name}`)
const timezone = computed(() => {
  const { offset, description } = props.user.location.timezone
  return `${offset} (${description})`
})
const detailsId = computed(() => `user-details-${props.user.id}`)

function toggleDetails(): void {
  isDetailsOpen.value = !isDetailsOpen.value
}
</script>

<template>
  <article
    class="user-card"
    :class="{
      'user-card--minor': ageGroup === 'minor',
      'user-card--young': ageGroup === 'young',
      'user-card--adult': ageGroup === 'adult',
      'user-card--senior': ageGroup === 'senior',
    }"
  >
    <div class="user-card__profile">
      <img
        class="user-card__photo"
        :src="user.picture"
        :alt="`${user.name.first} ${user.name.last}`"
        width="552"
        height="476"
        loading="lazy"
      />

      <h2 class="user-card__name">{{ displayName }}</h2>

      <ul class="user-card__meta">
        <li>
          <AppIcon :name="user.gender === 'female' ? 'venus' : 'mars'" :size="18" />
          {{ capitalize(user.gender) }}
        </li>
        <li v-if="age > 18">
          <AppIcon name="calendar" :size="18" />
          {{ age }} years
        </li>
        <li class="user-card__group">{{ ageGroup }}</li>
      </ul>

      <ul class="user-card__contacts">
        <li><AppIcon name="pin" :size="18" /> {{ shortLocation }}</li>
        <li><AppIcon name="mail" :size="18" /> {{ user.email }}</li>
        <li><AppIcon name="phone" :size="18" /> {{ user.phone }}</li>
        <li><AppIcon name="mobile" :size="18" /> {{ user.cell }}</li>
      </ul>
    </div>

    <div class="user-card__body">
      <button
        class="user-card__about"
        type="button"
        :aria-expanded="isDetailsOpen"
        :aria-controls="detailsId"
        @click="toggleDetails"
      >
        <AppIcon name="user" :size="22" />
        <span>About me</span>
        <AppIcon class="user-card__chevron" :class="{ 'user-card__chevron--open': isDetailsOpen }" name="chevron" :size="20" />
      </button>
      <p v-show="isDetailsOpen" :id="detailsId" class="user-card__details">{{ user.details }}</p>

      <div class="user-card__panel">
        <section class="user-card__section">
          <h3 class="user-card__heading"><AppIcon name="document" :size="22" /> Personal Information</h3>
          <dl class="user-card__list">
            <dt>Full name</dt>
            <dd>{{ user.name.title }} {{ fullName }}</dd>
            <dt>Gender</dt>
            <dd>{{ capitalize(user.gender) }}</dd>
            <dt>Date of birth</dt>
            <dd>
              {{ formatDob(user.dob.date) }}
              <template v-if="age > 18">(age {{ age }})</template>
            </dd>
            <dt>Email</dt>
            <dd>{{ user.email }}</dd>
            <dt>Phone</dt>
            <dd>{{ user.phone }}</dd>
            <dt>Cell</dt>
            <dd>{{ user.cell }}</dd>
          </dl>
        </section>

        <section class="user-card__section">
          <h3 class="user-card__heading"><AppIcon name="pin" :size="22" /> Location</h3>
          <dl class="user-card__list">
            <dt>Street</dt>
            <dd>{{ street }}</dd>
            <dt>City</dt>
            <dd>{{ user.location.city }}</dd>
            <dt>State</dt>
            <dd>{{ user.location.state }}</dd>
            <dt>Country</dt>
            <dd>{{ user.location.country }}</dd>
            <dt>Postcode</dt>
            <dd>{{ user.location.postcode }}</dd>
            <dt>Timezone</dt>
            <dd>{{ timezone }}</dd>
          </dl>
        </section>

        <section class="user-card__section">
          <h3 class="user-card__heading"><AppIcon name="star" :size="22" /> Hobbies</h3>
          <ul class="user-card__hobbies">
            <li
              v-for="hobby in user.hobbies"
              :key="hobby"
              class="user-card__hobby"
              :class="`user-card__hobby--${getHobbyTone(hobby)}`"
            >
              {{ hobby }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Колір картки залежить від вікової групи (клас з :class). */
.user-card {
  --group: #2563eb;
  --group-tint: #eef3ff;

  display: grid;
  grid-template-columns: minmax(260px, 380px) 1fr;
  overflow: hidden;
  background: var(--surface);
  border-top: 6px solid var(--group);
  border-radius: 20px;
  box-shadow: 0 1px 2px rgb(16 27 74 / 6%), 0 10px 28px rgb(16 27 74 / 7%);
}

.user-card--minor {
  --group: #f59e0b;
  --group-tint: #fff6e5;
}

.user-card--young {
  --group: #16a34a;
  --group-tint: #ebf8f0;
}

.user-card--adult {
  --group: #2563eb;
  --group-tint: #eef3ff;
}

.user-card--senior {
  --group: #7c3aed;
  --group-tint: #f4efff;
}

.user-card__profile {
  padding: 22px;
  background: linear-gradient(180deg, var(--group-tint), var(--surface) 70%);
  border-right: 1px solid var(--line);
}

.user-card__photo {
  display: block;
  width: 100%;
  aspect-ratio: 276 / 238;
  object-fit: cover;
  border-radius: 14px;
  background: var(--panel);
}

.user-card__name {
  margin: 20px 0 12px;
  font-size: 1.75rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.user-card__meta,
.user-card__contacts {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
}

.user-card__meta {
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-bottom: 18px;
  color: var(--ink-soft);
}

.user-card__meta li,
.user-card__contacts li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-card__group {
  padding: 2px 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--group);
  background: var(--surface);
  border: 1px solid var(--group);
  border-radius: 999px;
}

.user-card__contacts {
  flex-direction: column;
  gap: 14px;
  padding-top: 18px;
  color: var(--ink-soft);
  border-top: 1px solid var(--line);
  overflow-wrap: anywhere;
}

.user-card__body {
  min-width: 0;
  padding: 16px;
}

.user-card__about {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  font: inherit;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  background: var(--panel);
  border: 0;
  border-radius: 14px;
}

.user-card__about span {
  flex: 1;
}

.user-card__about:focus-visible {
  outline: 3px solid var(--group);
  outline-offset: 2px;
}

.user-card__chevron {
  transition: transform 0.2s ease;
}

.user-card__chevron--open {
  transform: rotate(180deg);
}

.user-card__details {
  margin: 10px 0 0;
  padding: 14px 18px;
  line-height: 1.55;
  color: var(--ink-soft);
  background: var(--group-tint);
  border-left: 4px solid var(--group);
  border-radius: 10px;
}

.user-card__panel {
  margin-top: 14px;
  border: 1px solid var(--line);
  border-radius: 14px;
}

.user-card__section {
  padding: 18px 20px;
}

.user-card__section + .user-card__section {
  border-top: 1px solid var(--line);
}

.user-card__heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;
  font-size: 1.1875rem;
  color: var(--ink);
}

.user-card__list {
  display: grid;
  grid-template-columns: minmax(96px, 170px) 1fr;
  gap: 8px 12px;
  margin: 0;
}

.user-card__list dt {
  color: var(--muted);
}

.user-card__list dd {
  margin: 0;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.user-card__hobbies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.user-card__hobby {
  padding: 6px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 999px;
}

.user-card__hobby--sky {
  color: #0b6ea8;
  background: #e4f3fc;
}

.user-card__hobby--violet {
  color: #6d28d9;
  background: #f0e9ff;
}

.user-card__hobby--green {
  color: #15803d;
  background: #e5f6ea;
}

.user-card__hobby--amber {
  color: #a16207;
  background: #fff3d6;
}

.user-card__hobby--rose {
  color: #be123c;
  background: #ffe8ee;
}

.user-card__hobby--indigo {
  color: #3730a3;
  background: #e8ebff;
}

.user-card__hobby--teal {
  color: #0f766e;
  background: #dcf5f1;
}

.user-card__hobby--slate {
  color: #475569;
  background: #eceff4;
}

@media (max-width: 760px) {
  .user-card {
    grid-template-columns: 1fr;
  }

  .user-card__profile {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .user-card__list {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .user-card__list dd {
    margin-bottom: 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .user-card__chevron {
    transition: none;
  }
}
</style>
