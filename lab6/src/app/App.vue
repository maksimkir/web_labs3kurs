<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppToast } from '@/shared/ui'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'

const LAYOUTS = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const route = useRoute()

// layout обирається полем meta.layout поточного маршруту
const layout = computed(() => LAYOUTS[route.meta.layout ?? 'default'])
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
  <AppToast />
</template>
