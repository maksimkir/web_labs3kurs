<script setup lang="ts">
import TheParticipantsBlock from '@/components/TheParticipantsBlock.vue'
import TheRegisterBlock from '@/components/TheRegisterBlock.vue'
import TheWinnersBlock from '@/components/TheWinnersBlock.vue'
import { useLottery } from '@/composables/useLottery'

const {
  participants,
  winners,
  canDrawWinner,
  addParticipant,
  updateParticipant,
  removeParticipant,
  drawWinner,
  removeWinner,
} = useLottery()
</script>

<template>
  <main class="lottery">
    <h1 class="visually-hidden">
      Lottery
    </h1>

    <TheWinnersBlock
      :winners="winners"
      :can-draw="canDrawWinner"
      @draw="drawWinner"
      @remove="removeWinner"
    />
    <TheRegisterBlock
      :participants="participants"
      @submit="addParticipant"
    />
    <TheParticipantsBlock
      :participants="participants"
      @update="updateParticipant"
      @remove="removeParticipant"
    />
  </main>
</template>
