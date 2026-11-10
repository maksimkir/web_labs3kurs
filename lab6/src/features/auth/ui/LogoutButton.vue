<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSessionStore } from '@/entities/session'
import { AppButton } from '@/shared/ui'

const router = useRouter()
const session = useSessionStore()

function logout(): void {
  // очищаємо токени й переходимо на сторінку входу
  session.clearSession()
  router.push({ name: 'login' })
}
</script>

<template>
  <AppButton
    label="Logout"
    icon="pi pi-sign-out"
    variant="outlined"
    size="small"
    @click="logout"
  />
</template>
