<template>
  <section class="card">
    <div class="card-body-padded not-found">
      <p class="not-found__code">
        404
      </p>
      <h1 class="not-found__title">
        Сторінку не знайдено
      </h1>
      <p class="not-found__text">
        Можливо, адресу введено з помилкою або сторінку було видалено.
      </p>
      <RouterLink
        :to="{ name: 'home' }"
        class="btn btn-primary"
      >
        На головну
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.not-found {
  padding: 3rem 1.25rem;
  text-align: center;
}

.not-found__code {
  margin: 0;
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--bs-primary);
}

.not-found__title {
  margin: 0.75rem 0 0.5rem;
  font-size: 1.375rem;
}

.not-found__text {
  color: var(--bs-secondary-color);
}
</style>
