<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="default-layout">
    <AppHeader />
    <main class="lottery">
      <slot />
    </main>
  </div>
</template>
