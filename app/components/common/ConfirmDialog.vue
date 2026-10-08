<template>
  <dialog ref="dialogRef" class="confirm-dialog" @cancel.prevent="emit('cancel')">
    <p class="message">{{ message }}</p>
    <div class="actions">
      <button type="button" class="button button-outline" :disabled="loading" @click="emit('cancel')">
        {{ cancelLabel }}
      </button>
      <button type="button" class="button button-danger" :disabled="loading" @click="emit('confirm')">
        {{ loading ? '처리 중…' : confirmLabel }}
      </button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  message: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}>(), {
  confirmLabel: '확인',
  cancelLabel: '취소',
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (open) => {
    const dialog = dialogRef.value
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  },
)
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.confirm-dialog {
  width: min(90vw, 380px);
  padding: 28px 24px 24px;
  border: none;
  border-radius: $radius-lg;
  box-shadow: $shadow-md;
  color: $text-color;

  &::backdrop {
    background-color: rgba(22, 24, 29, 0.5);
  }
}

.message {
  margin: 0 0 24px;
  font-size: 1.0625rem;
  font-weight: 650;
  line-height: 1.5;
  text-align: center;
  word-break: keep-all;
}

.actions {
  display: flex;
  gap: 10px;
}

.button {
  flex: 1;
  height: 48px;
  border: $border-width solid transparent;
  border-radius: $radius-md;
  font: inherit;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.button-outline {
  border-color: $line-color;
  background-color: $surface-color;
  color: $text-color;
}

.button-danger {
  background-color: $error-color;
  color: #fff;
}
</style>
