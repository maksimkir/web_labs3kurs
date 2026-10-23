import { computed, ref, watch } from 'vue'
import type { Participant, ParticipantFormValues } from '@/types/participant'
import { createId } from '@/utils/id'
import {
  isParticipantList,
  isStringList,
  loadFromStorage,
  saveToStorage,
} from '@/utils/storage'

export const MAX_WINNERS = 3
export const STORAGE_KEYS = {
  participants: 'vue-lottery:participants',
  winners: 'vue-lottery:winners',
} as const

/** Стан лотереї: учасники, переможці та дії над ними. */
export function useLottery() {
  // Відновлення при завантаженні застосунку.
  const participants = ref<Participant[]>(
    loadFromStorage(STORAGE_KEYS.participants, isParticipantList, []),
  )
  const winnerIds = ref<string[]>(
    loadFromStorage(STORAGE_KEYS.winners, isStringList, []).filter((id) =>
      participants.value.some((p) => p.id === id),
    ),
  )

  // Збереження: watcher з опцією deep.
  watch(participants, (value) => saveToStorage(STORAGE_KEYS.participants, value), { deep: true })
  watch(winnerIds, (value) => saveToStorage(STORAGE_KEYS.winners, value), { deep: true })

  const winners = computed(() =>
    winnerIds.value
      .map((id) => participants.value.find((p) => p.id === id))
      .filter((p): p is Participant => p !== undefined),
  )

  /** Учасники, які ще не стали переможцями. */
  const candidates = computed(() => participants.value.filter((p) => !winnerIds.value.includes(p.id)))

  const canDrawWinner = computed(
    () => winnerIds.value.length < MAX_WINNERS && candidates.value.length > 0,
  )

  function addParticipant(values: ParticipantFormValues): void {
    participants.value.push({ id: createId(), ...values })
  }

  function updateParticipant(id: string, values: ParticipantFormValues): void {
    const participant = participants.value.find((p) => p.id === id)
    if (participant) Object.assign(participant, values)
  }

  function removeParticipant(id: string): void {
    participants.value = participants.value.filter((p) => p.id !== id)
    // Видалений учасник зникає і з блоку переможців.
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  }

  function drawWinner(): void {
    if (!canDrawWinner.value) return
    const pool = candidates.value
    const winner = pool[Math.floor(Math.random() * pool.length)]
    if (winner) winnerIds.value.push(winner.id)
  }

  function removeWinner(id: string): void {
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  }

  return {
    participants,
    winners,
    canDrawWinner,
    addParticipant,
    updateParticipant,
    removeParticipant,
    drawWinner,
    removeWinner,
  }
}
