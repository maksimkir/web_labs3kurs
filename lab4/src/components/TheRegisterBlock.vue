<script setup lang="ts">
import ParticipantForm from '@/components/ParticipantForm.vue'
import type { Participant, ParticipantFormValues } from '@/types/participant'

defineProps<{ participants: readonly Participant[] }>()
const emit = defineEmits<{ submit: [values: ParticipantFormValues] }>()
</script>

<template>
  <section
    class="card"
    aria-labelledby="register-title"
  >
    <div class="register-block">
      <h2
        id="register-title"
        class="register-block__title"
      >
        Register form
      </h2>
      <p class="register-block__subtitle">
        Please fill in all the fields.
      </p>
      <ParticipantForm
        :participants="participants"
        submit-label="Save"
        reset-on-submit
        @submit="emit('submit', $event)"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.register-block {
  padding: 1.125rem 1.25rem 1.25rem;
}

.register-block__title {
  margin: 0 0 0.125rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--lottery-ink);
  text-transform: uppercase;
}

.register-block__subtitle {
  margin: 0 0 1.25rem;
  color: var(--bs-secondary-color);
}
</style>
