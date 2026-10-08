<template>
  <div class="home">
    <ImageSlider />
    <IconMenu />
    <TodayFood />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.home {
  display: flex;
  flex-direction: column;
  gap: 40px;
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 24px 16px 64px;
}

@media (max-width: $mobile-max-width) {
  .home {
    gap: 28px;
    padding-top: 16px;
  }
}
</style>
