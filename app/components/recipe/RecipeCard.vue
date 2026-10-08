<template>
  <NuxtLink :to="`/recipes/${recipe.id}`" class="recipe-card">
    <div class="image-wrap">
      <img :src="recipe.image" :alt="recipe.name" class="image" loading="lazy">
      <span class="category">{{ recipe.category }}</span>
    </div>
    <div class="body">
      <h3 class="name">{{ recipe.name }}</h3>
      <p class="description">{{ recipe.description }}</p>
      <dl class="meta">
        <div class="meta-item">
          <dt>난이도</dt>
          <dd class="stars" :aria-label="`3점 만점 중 ${recipe.difficulty}`">{{ difficultyStars }}</dd>
        </div>
        <div class="meta-item">
          <dt>조리시간</dt>
          <dd>{{ recipe.cookingTime }}분</dd>
        </div>
      </dl>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  recipe: RecipeSummary
}>()

const difficultyStars = computed<string>(() => formatDifficulty(props.recipe.difficulty))
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: $radius-lg;
  background-color: $surface-color;
  box-shadow: $shadow-sm;
  color: $text-color;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-4px);

    .image {
      transform: scale(1.04);
    }
  }

  &:focus-visible {
    outline: 2px solid $point-color;
    outline-offset: 3px;
  }
}

.image-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background-color: $line-color;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.9);
  color: $text-color;
  font-size: 0.75rem;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px 18px;
}

.name {
  margin: 0;
  font-size: $font-size-h3;
  font-weight: 750;
  letter-spacing: $tracking-snug;
  line-height: 1.35;
}

.description {
  display: -webkit-box;
  flex: 1;
  margin: 0;
  overflow: hidden;
  color: $sub-text-color;
  font-size: 0.9375rem;
  line-height: 1.6;
  word-break: keep-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.meta {
  display: flex;
  gap: 14px;
  margin: 8px 0 0;
  padding-top: 12px;
  border-top: 1px solid $line-color;
  font-size: $font-size-caption;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;

  dt {
    color: $sub-text-color;
  }

  dd {
    margin: 0;
    font-weight: 600;
  }
}

.stars {
  color: $point-color;
  letter-spacing: 1px;
}
</style>
