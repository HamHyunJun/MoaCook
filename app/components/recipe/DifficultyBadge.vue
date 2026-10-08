<template>
  <span class="difficulty-badge" :class="`level-${difficulty}`">
    <span class="bars" aria-hidden="true">
      <span v-for="level in 3" :key="level" class="bar" :class="{ on: level <= difficulty }" />
    </span>
    {{ formatDifficulty(difficulty) }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  difficulty: RecipeDifficulty
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.difficulty-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

// 막대 3개로 난이도를 보여 준다 (신호 세기 표시처럼 점점 높아진다)
.bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.bar {
  width: 3px;
  border-radius: 1px;
  background-color: $line-strong-color;

  &:nth-child(1) { height: 6px; }
  &:nth-child(2) { height: 9px; }
  &:nth-child(3) { height: 12px; }

  &.on {
    background-color: $point-color;
  }
}
</style>
