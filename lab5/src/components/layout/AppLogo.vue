<template>
  <RouterLink
    :to="{ name: 'home' }"
    class="app-logo"
    aria-label="Vue Lottery — на головну"
  >
    <svg
      class="app-logo__mark"
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden="true"
    >
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="currentColor"
      />
      <path
        d="M9 10h4l3 7 3-7h4l-7 13z"
        fill="#fff"
      />
    </svg>
    <span class="app-logo__text">Vue Lottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--bs-primary);
  text-decoration: none;
}

.app-logo__text {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--lottery-ink);
}
</style>
