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
  border: 1px solid #eee;
  border-radius: 12px;
  background-color: #fff;
  color: $text-color;
  text-align: left;
  text-decoration: none;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.image-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  background-color: #f5f5f5;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: $point-color;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
}

.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px 16px;
}

.name {
  margin: 0;
  font-size: 1.15rem;
}

.description {
  flex: 1;
  margin: 0;
  color: $sub-text-color;
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: keep-all;
}

.meta {
  display: flex;
  gap: 16px;
  margin: 6px 0 0;
  font-size: 0.85rem;
}

.meta-item {
  display: flex;
  gap: 6px;

  dt {
    color: $sub-text-color;
  }

  dd {
    margin: 0;
    font-weight: bold;
  }
}

.stars {
  color: $point-color;
  letter-spacing: 1px;
}
</style>
