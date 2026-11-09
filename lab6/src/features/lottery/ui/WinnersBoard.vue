<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { fullName, type User } from '@/entities/user'
import { AppButton, AppCard, AppChip } from '@/shared/ui'
import { MAX_WINNERS, useLotteryStore } from '../model/lottery.store'

/** Учасники поточної сторінки, серед яких обирається переможець. */
const props = defineProps<{ pool: readonly User[] }>()

const lottery = useLotteryStore()
const { winners } = storeToRefs(lottery)
</script>

<template>
  <AppCard>
    <div class="winners-board">
      <ul
        class="winners-board__list"
        aria-live="polite"
        aria-label="Winners"
      >
        <li
          v-for="winner in winners"
          :key="winner.id"
        >
          <AppChip
            :label="fullName(winner)"
            removable
            :remove-label="`Remove winner ${fullName(winner)}`"
            @remove="lottery.remove(winner.id)"
          />
        </li>
        <li class="winners-board__placeholder">
          Winners ({{ winners.length }}/{{ MAX_WINNERS }})
        </li>
      </ul>
      <AppButton
        label="New winner"
        icon="pi pi-trophy"
        :disabled="!lottery.canDraw(props.pool)"
        @click="lottery.draw(props.pool)"
      />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.winners-board {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.winners-board__list {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 0.375rem;
  align-items: center;
  min-height: 2.5rem;
  padding: 0.25rem 0.5rem;
  margin: 0;
  list-style: none;
  border: 1px solid var(--p-content-border-color);
  border-radius: var(--p-content-border-radius);
}

.winners-board__placeholder {
  color: var(--p-text-muted-color);
}

@media (max-width: 575.98px) {
  .winners-board {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
