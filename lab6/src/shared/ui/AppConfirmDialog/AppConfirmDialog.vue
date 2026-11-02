<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from '../AppButton/AppButton.vue'

withDefaults(
  defineProps<{
    header: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
  }>(),
  { message: '', confirmLabel: 'Так', cancelLabel: 'Ні', loading: false },
)

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <!-- модальне вікно підтвердження; Esc і клік по хрестику закривають його -->
  <Dialog
    v-model:visible="visible"
    :header="header"
    modal
    :draggable="false"
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '92vw' }"
  >
    <p class="app-confirm__message">
      {{ message }}
    </p>
    <slot />
    <template #footer>
      <AppButton
        :label="confirmLabel"
        severity="danger"
        :loading="loading"
        @click="emit('confirm')"
      />
      <AppButton
        :label="cancelLabel"
        severity="secondary"
        variant="outlined"
        @click="visible = false"
      />
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.app-confirm__message {
  margin: 0;
}
</style>
