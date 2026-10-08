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
.confirm-dialog {
  width: min(90vw, 360px);
  padding: 24px;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.message {
  margin: 0 0 20px;
  font-size: 1.05rem;
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
  padding: 10px 0;
  border: 1px solid transparent;
  border-radius: 8px;
  font: inherit;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.button-outline {
  border-color: #e5e5e5;
  background-color: #fff;
  color: #2c3e50;
}

.button-danger {
  background-color: #d93025;
  color: #fff;
}
</style>
