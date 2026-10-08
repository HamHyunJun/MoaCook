<template>
  <article v-if="recipe" class="recipe-detail">
    <div class="top-bar">
      <NuxtLink :to="{ path: '/', query: { category: recipe.category } }" class="back-link">
        ← {{ recipe.category }} 레시피 목록
      </NuxtLink>
      <NuxtLink v-if="isAdmin" :to="`/admin/recipes/${recipe.id}/edit`" class="edit-link">수정하기</NuxtLink>
    </div>

    <header class="summary">
      <div class="hero">
        <img :src="recipe.image" :alt="recipe.name" class="hero-image">
      </div>
      <div class="summary-body">
        <span class="category">{{ recipe.category }}</span>
        <h1 class="name">{{ recipe.name }}</h1>
        <p class="description">{{ recipe.description }}</p>
        <dl class="meta">
          <div class="meta-item">
            <dt>난이도</dt>
            <dd class="stars" :aria-label="`3점 만점 중 ${recipe.difficulty}`">
              {{ formatDifficulty(recipe.difficulty) }}
            </dd>
          </div>
          <div class="meta-item">
            <dt>조리시간</dt>
            <dd>{{ recipe.cookingTime }}분</dd>
          </div>
          <div class="meta-item">
            <dt>재료</dt>
            <dd>{{ recipe.ingredients.length }}가지</dd>
          </div>
        </dl>
      </div>
    </header>

    <section class="section" aria-labelledby="ingredients-title">
      <h2 id="ingredients-title" class="section-title">재료</h2>
      <ul class="ingredients">
        <li v-for="ingredient in recipe.ingredients" :key="ingredient.id" class="ingredient">
          <span class="ingredient-name">{{ ingredient.name }}</span>
          <span class="ingredient-amount">{{ ingredient.amount }}</span>
        </li>
      </ul>
    </section>

    <section class="section" aria-labelledby="steps-title">
      <h2 id="steps-title" class="section-title">조리 과정</h2>
      <ol class="steps">
        <li v-for="step in sortedSteps" :key="step.id" class="step">
          <span class="step-number" aria-hidden="true">{{ formatStepNumber(step.order) }}</span>
          <div class="step-body">
            <p class="step-description">{{ step.description }}</p>
            <img
              v-if="step.image"
              :src="step.image"
              :alt="`${recipe.name} 조리 과정 ${step.order}`"
              class="step-image"
              loading="lazy"
            >
          </div>
        </li>
      </ol>
    </section>

    <RecipeYoutube :query="recipe.youtubeQuery || recipe.name" class="section" />
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { isAdmin } = useAdmin()
const id = computed<string>(() => String(route.params.id))

const { data: recipe, error } = await useFetch<Recipe>(() => `/api/recipes/${encodeURIComponent(id.value)}`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusCode === 404 ? '레시피를 찾을 수 없습니다.' : '레시피를 불러오지 못했습니다.',
    fatal: true,
  })
}

const sortedSteps = computed<RecipeStep[]>(() =>
  [...(recipe.value?.steps ?? [])].sort((a, b) => a.order - b.order),
)

function formatStepNumber(order: number): string {
  return String(order).padStart(2, '0')
}

useHead({ title: () => (recipe.value ? `${recipe.value.name} | MoaCook` : 'MoaCook') })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 20px 80px;
  text-align: left;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.edit-link {
  padding: 6px 14px;
  border: 1px solid $line-color;
  border-radius: 999px;
  background-color: $surface-color;
  color: $text-color;
  font-size: $font-size-small;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    border-color: $point-color;
  }
}

.back-link {
  display: inline-block;
  color: $sub-text-color;
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    color: $text-color;
  }
}

.summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 16px;
}

.hero {
  overflow: hidden;
  border-radius: $radius-lg;
  aspect-ratio: 4 / 3;
  background-color: $line-color;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category {
  align-self: flex-start;
  padding: 5px 12px;
  border-radius: 999px;
  background-color: $point-soft-color;
  color: $point-strong-color;
  font-size: $font-size-caption;
  font-weight: 700;
}

.name {
  margin: 0;
  font-size: $font-size-h1;
  font-weight: 820;
  letter-spacing: $tracking-tight;
  line-height: 1.2;
}

.description {
  margin: 0;
  color: $sub-text-color;
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.65;
}

.meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 8px 0 0;
  padding: 16px 0;
  border-radius: $radius-md;
  background-color: $surface-color;
  box-shadow: $shadow-sm;
  text-align: center;
}

.meta-item {
  dt {
    margin-bottom: 4px;
    color: $sub-text-color;
    font-size: $font-size-caption;
    font-weight: 500;
  }

  dd {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 750;
    letter-spacing: $tracking-snug;
  }

  & + & {
    border-left: 1px solid $line-color;
  }
}

.stars {
  color: $point-color;
  letter-spacing: 1px;
}

.section {
  margin-top: 40px;
}

.section-title {
  margin: 0 0 16px;
  font-size: $font-size-h2;
  font-weight: 800;
  letter-spacing: $tracking-snug;
}

.ingredients {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0;
  padding: 8px 20px;
  border-radius: $radius-lg;
  background-color: $surface-color;
  box-shadow: $shadow-sm;
  list-style: none;
}

.ingredient {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid $line-color;
  font-size: $font-size-body;
  font-weight: 500;

  &:last-child {
    border-bottom: none;
  }
}

.ingredient-amount {
  color: $sub-text-color;
  white-space: nowrap;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: $radius-lg;
  background-color: $surface-color;
  box-shadow: $shadow-sm;
}

.step-number {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: $point-soft-color;
  color: $point-strong-color;
  font-size: $font-size-small;
  font-weight: 800;
  letter-spacing: 0;
}

.step-body {
  flex: 1;
  min-width: 0;
  padding-top: 5px;
}

.step-description {
  margin: 0;
  font-size: 1.0625rem;
  line-height: 1.75;
}

.step-image {
  display: block;
  width: 100%;
  max-width: 480px;
  margin-top: 12px;
  border-radius: $radius-md;
}

@media (min-width: $tablet-max-width) {
  .recipe-detail {
    padding-top: 32px;
  }

  .summary {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 40px;
  }

  .name {
    font-size: $font-size-display;
  }

  .ingredients {
    grid-template-columns: 1fr 1fr;
    column-gap: 40px;

    // 두 줄 배치에서는 마지막 줄 두 항목 모두 밑줄을 없앤다
    .ingredient:nth-last-child(2):nth-child(odd) {
      border-bottom: none;
    }
  }
}
</style>
