<template>
  <span class="app-logo">
    <svg class="mark" viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="11" class="mark-bg" />
      <path d="M8.5 20.5h23a11.5 11.5 0 0 1-23 0Z" class="mark-bowl" />
      <path
        d="M15.5 8.5c-1.6 1.7 1.6 3.3 0 5M20 7c-1.6 1.7 1.6 3.3 0 5M24.5 8.5c-1.6 1.7 1.6 3.3 0 5"
        class="mark-steam"
      />
    </svg>
    <span class="wordmark">Moa<span class="wordmark-point">Cook</span></span>
  </span>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
}

.mark {
  flex-shrink: 0;
  width: 1.75em;
  height: 1.75em;
}

.mark-bg {
  fill: $point-color;
}

.mark-bowl {
  fill: #fff;
}

.mark-steam {
  fill: none;
  stroke: #fff;
  stroke-width: 2.2;
  stroke-linecap: round;
}

.wordmark {
  color: $text-color;
  font-weight: 850;
  letter-spacing: -0.045em;
  line-height: 1;
}

.wordmark-point {
  color: $point-color;
}
</style>
