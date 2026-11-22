<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'
</script>

<template>
  <AppCard>
    <div class="not-found">
      <p class="not-found__code">
        404
      </p>
      <h1 class="not-found__title">
        Сторінку не знайдено
      </h1>
      <p class="not-found__text">
        Можливо, адресу введено з помилкою або сторінку було видалено.
      </p>
      <AppButton
        label="На головну"
        icon="pi pi-home"
        :to="{ name: 'home' }"
      />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.not-found {
  padding: 2rem 0;
  text-align: center;
}

.not-found__code {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--p-primary-color);
}

.not-found__title {
  margin: 0.75rem 0 0.5rem;
  font-size: 1.375rem;
}

.not-found__text {
  color: var(--p-text-muted-color);
}
</style>
