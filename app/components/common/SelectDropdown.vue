<template>
  <div ref="root" class="select-dropdown" :class="{ open: isOpen, selected: modelValue !== undefined }">
    <button
      ref="trigger"
      type="button"
      class="trigger"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-label="`${label}: ${selectedLabel}`"
      @click="toggle"
      @keydown="onTriggerKeydown"
    >
      <span class="trigger-label">{{ selectedLabel }}</span>
      <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <Transition name="dropdown">
      <ul
        v-if="isOpen"
        ref="listbox"
        class="options"
        role="listbox"
        tabindex="-1"
        :aria-label="label"
        :aria-activedescendant="optionId(activeIndex)"
        @keydown="onListKeydown"
      >
        <li
          v-for="(option, index) in allOptions"
          :id="optionId(index)"
          :key="String(option.value)"
          role="option"
          class="option"
          :class="{ active: index === activeIndex, checked: option.value === modelValue }"
          :aria-selected="option.value === modelValue"
          @click="select(option.value)"
          @mouseenter="activeIndex = index"
        >
          <span>{{ option.label }}</span>
          <svg v-if="option.value === modelValue" class="check" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12 5 5 9-10" />
          </svg>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
export interface SelectOption<V> {
  value: V
  label: string
}

const props = defineProps<{
  modelValue: T | undefined
  options: SelectOption<T>[]
  /** 스크린 리더용 이름 (예: "난이도") */
  label: string
  /** 선택하지 않았을 때 보이는 문구 (예: "난이도 전체") */
  allLabel: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T | undefined]
}>()

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLButtonElement | null>(null)
const listbox = ref<HTMLUListElement | null>(null)
const isOpen = ref<boolean>(false)
const activeIndex = ref<number>(0)

const uid = useId()

// 맨 앞에 "전체"(선택 해제) 항목을 둔다
const allOptions = computed<SelectOption<T | undefined>[]>(() => [
  { value: undefined, label: props.allLabel },
  ...props.options,
])

const selectedLabel = computed<string>(() =>
  props.options.find(option => option.value === props.modelValue)?.label ?? props.allLabel,
)

function optionId(index: number): string {
  return `${uid}-option-${index}`
}

async function open(): Promise<void> {
  const selectedIndex = allOptions.value.findIndex(option => option.value === props.modelValue)
  activeIndex.value = Math.max(selectedIndex, 0)
  isOpen.value = true
  await nextTick()
  listbox.value?.focus()
}

function close(focusTrigger = false): void {
  isOpen.value = false
  if (focusTrigger) trigger.value?.focus()
}

function toggle(): void {
  if (isOpen.value) close()
  else open()
}

function select(value: T | undefined): void {
  emit('update:modelValue', value)
  close(true)
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (['ArrowDown', 'ArrowUp'].includes(event.key) && !isOpen.value) {
    event.preventDefault()
    open()
  }
}

function onListKeydown(event: KeyboardEvent): void {
  const lastIndex = allOptions.value.length - 1

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      activeIndex.value = Math.min(activeIndex.value + 1, lastIndex)
      break
    case 'ArrowUp':
      event.preventDefault()
      activeIndex.value = Math.max(activeIndex.value - 1, 0)
      break
    case 'Home':
      event.preventDefault()
      activeIndex.value = 0
      break
    case 'End':
      event.preventDefault()
      activeIndex.value = lastIndex
      break
    case 'Enter':
    case ' ': {
      event.preventDefault()
      const option = allOptions.value[activeIndex.value]
      if (option) select(option.value)
      break
    }
    case 'Escape':
      event.preventDefault()
      close(true)
      break
    case 'Tab':
      close()
      break
  }
}

// 바깥을 누르면 닫는다
function onDocumentPointerDown(event: PointerEvent): void {
  if (isOpen.value && root.value && !root.value.contains(event.target as Node)) {
    close()
  }
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.select-dropdown {
  position: relative;
}

.trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 140px;
  height: 40px;
  padding: 0 14px 0 16px;
  border: $border-width solid $line-color;
  border-radius: 999px;
  background-color: $surface-color;
  color: $text-color;
  font-size: $font-size-small;
  font-weight: 650;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    border-color: $line-strong-color;
  }

  &:focus-visible {
    outline: 2px solid $point-color;
    outline-offset: 2px;
  }

  .open & {
    border-color: $text-color;
  }

  .selected & {
    border-color: $text-color;
  }
}

.trigger-label {
  white-space: nowrap;
}

.chevron {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  fill: none;
  stroke: $text-color;
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: transform 0.2s ease;

  .open & {
    transform: rotate(180deg);
  }
}

.options {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  min-width: 100%;
  margin: 0;
  padding: 6px;
  border: 1px solid $line-color;
  border-radius: $radius-md;
  outline: none;
  background-color: $surface-color;
  box-shadow: $shadow-md;
  list-style: none;
  text-align: left;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 10px 12px;
  border-radius: 8px;
  color: $text-color;
  font-size: $font-size-small;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &.active {
    background-color: $fill-color;
  }

  &.checked {
    font-weight: 700;
  }
}

.check {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: $point-color;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
