<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import WinnerItem from '@/components/WinnerItem.vue'
import type { Participant } from '@/types/participant'

defineProps<{
  winners: readonly Participant[]
  canDraw: boolean
}>()

const emit = defineEmits<{
  draw: []
  remove: [id: string]
}>()
</script>

<template>
  <section
    class="card"
    aria-label="Winners"
  >
    <div class="winners-block">
      <div class="winners-block__field">
        <ul
          class="winners-block__list"
          aria-live="polite"
        >
          <WinnerItem
            v-for="winner in winners"
            :key="winner.id"
            :name="winner.name"
            @remove="emit('remove', winner.id)"
          />
        </ul>
        <span class="winners-block__placeholder">Winners</span>
      </div>
      <BaseButton
        :disabled="!canDraw"
        @click="emit('draw')"
      >
        New winner
      </BaseButton>
    </div>
  </section>
</template>

<style scoped lang="scss">
.winners-block {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  padding: 1rem 1.25rem;
}

.winners-block__field {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  min-height: 2.375rem;
  padding: 0.25rem 0.5rem;
  background: #fff;
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
}

.winners-block__list {
  display: contents;
  padding: 0;
  margin: 0;
  list-style: none;
}

.winners-block__placeholder {
  color: var(--bs-secondary-color);
}

@media (max-width: 575.98px) {
  .winners-block {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
