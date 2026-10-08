<template>
  <div class="recipe-card-skeleton">
    <div class="image skeleton" />
    <div class="line name skeleton" />
    <div class="line skeleton" />
    <div class="line short skeleton" />
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image {
  margin-bottom: 6px;
  border-radius: $radius-lg;
  aspect-ratio: 4 / 3;
}

.line {
  height: 14px;
  border-radius: 6px;
}

.name {
  width: 60%;
  height: 20px;
}

.short {
  width: 40%;
}

@media (max-width: $mobile-max-width) {
  .image {
    border-radius: $radius-md;
    aspect-ratio: 1 / 1;
  }
}
</style>
