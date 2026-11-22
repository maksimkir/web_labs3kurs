<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { AppButton } from '@/shared/ui'
import { useThemeStore } from '../model/theme.store'

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
</script>

<template>
  <AppButton
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    severity="secondary"
    variant="text"
    :aria-label="isDark ? 'Світла тема' : 'Темна тема'"
    :title="isDark ? 'Світла тема' : 'Темна тема'"
    @click="themeStore.toggle"
  />
</template>
