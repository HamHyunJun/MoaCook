<template>
  <NuxtLink :to="`/recipes/${recipe.id}`" class="recipe-card">
    <div class="image-wrap">
      <img :src="recipe.image" :alt="recipe.name" class="image" loading="lazy">
      <span class="category">{{ recipe.category }}</span>
    </div>
    <div class="body">
      <h3 class="name">{{ recipe.name }}</h3>
      <p class="description">{{ recipe.description }}</p>
      <div class="meta">
        <span class="meta-item">
          <svg class="clock" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          {{ recipe.cookingTime }}분
        </span>
        <DifficultyBadge :difficulty="recipe.difficulty" class="meta-item" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  recipe: RecipeSummary
}>()
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: $text-color;
  text-align: left;
  text-decoration: none;

  &:hover .image {
    transform: scale(1.05);
  }

  &:hover .name {
    color: $point-strong-color;
  }

  &:focus-visible {
    border-radius: $radius-lg;
    outline: 2px solid $point-color;
    outline-offset: 4px;
  }
}

.image-wrap {
  position: relative;
  overflow: hidden;
  border-radius: $radius-lg;
  aspect-ratio: 4 / 3;
  background-color: $fill-color;
}

.image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 11px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.95);
  color: $text-color;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.4;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: 14px 2px 0;
}

.name {
  margin: 0;
  font-size: $font-size-h3;
  font-weight: 750;
  letter-spacing: $tracking-snug;
  line-height: 1.4;
  transition: color 0.15s ease;
}

.description {
  display: -webkit-box;
  flex: 1;
  margin: 0;
  overflow: hidden;
  color: $sub-text-color;
  font-size: 0.9375rem;
  line-height: 1.55;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
  color: $text-color;
  font-size: $font-size-caption;
  font-weight: 650;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.clock {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: $sub-text-color;
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}

// 모바일 2열 배치에 맞춰 글자와 여백을 줄인다
@media (max-width: $mobile-max-width) {
  .image-wrap {
    border-radius: $radius-md;
    aspect-ratio: 1 / 1;
  }

  .category {
    top: 8px;
    left: 8px;
    padding: 3px 8px;
    font-size: 0.6875rem;
  }

  .body {
    gap: 2px;
    padding-top: 10px;
  }

  .name {
    font-size: 1rem;
  }

  .description {
    font-size: $font-size-caption;
  }

  .meta {
    gap: 10px;
    margin-top: 8px;
    font-size: 0.75rem;
  }
}
</style>
