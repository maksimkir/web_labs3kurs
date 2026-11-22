import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUsersStore, type User } from '@/entities/user'

export const MAX_WINNERS = 3

// Стан лотереї: до трьох переможців серед учасників поточної сторінки.
export const useLotteryStore = defineStore(
  'lottery',
  () => {
    const winners = ref<User[]>([])

    const isFull = computed(() => winners.value.length >= MAX_WINNERS)

    function candidates(pool: readonly User[]): User[] {
      return pool.filter((u) => !winners.value.some((w) => w.id === u.id))
    }

    function canDraw(pool: readonly User[]): boolean {
      return !isFull.value && candidates(pool).length > 0
    }

    function draw(pool: readonly User[]): void {
      if (!canDraw(pool)) return
      const available = candidates(pool)
      const winner = available[Math.floor(Math.random() * available.length)]
      if (winner) winners.value.push(winner)
    }

    function remove(id: number): void {
      winners.value = winners.value.filter((w) => w.id !== id)
    }

    // Переможці синхронізуються з діями стору користувачів ($onAction):
    // видалений учасник зникає з переможців, оновлений — оновлюється.
    useUsersStore().$onAction(({ name, args, after }) => {
      after((result) => {
        if (name === 'removeUser') remove(args[0] as number)
        if (name === 'updateUser') {
          const user = result as User
          winners.value = winners.value.map((w) => (w.id === user.id ? user : w))
        }
      })
    })

    return { winners, isFull, canDraw, draw, remove }
  },
  { persist: true },
)
