<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const modalRef = ref<HTMLElement | null>(null)
const titleId = useId()
let previouslyFocused: HTMLElement | null = null

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
      document.body.style.overflow = 'hidden'
      await nextTick()
      // Фокус усередині вікна потрібен, щоб працював @keydown.esc.
      modalRef.value?.focus()
    } else {
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="modal-layer"
      >
        <div class="modal-backdrop show" />
        <div
          ref="modalRef"
          class="modal"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          @keydown.esc="emit('close')"
          @click.self="emit('close')"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h2
                  :id="titleId"
                  class="modal-title"
                >
                  <slot name="header" />
                </h2>
                <button
                  type="button"
                  class="btn-close"
                  aria-label="Close"
                  @click="emit('close')"
                />
              </div>
              <div class="modal-body">
                <slot />
              </div>
              <div
                v-if="$slots.footer"
                class="modal-footer"
              >
                <slot name="footer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  display: block;
  overflow-y: auto;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
}

// CSS-переходи: плавна поява фону та "виїзд" вікна.
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;

  .modal-dialog {
    transition: transform 0.2s ease;
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;

  .modal-dialog {
    transform: translateY(-1.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-fade-enter-active,
  .modal-fade-leave-active,
  .modal-fade-enter-active .modal-dialog,
  .modal-fade-leave-active .modal-dialog {
    transition: none;
  }
}
</style>
