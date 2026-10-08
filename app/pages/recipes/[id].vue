<template>
  <article v-if="recipe" class="recipe-detail">
    <NuxtLink :to="{ path: '/recipes', query: { category: recipe.category } }" class="back-link">
      ← {{ recipe.category }} 레시피 목록
    </NuxtLink>

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
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
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
$point-color: #FFBD59;
$sub-text-color: #7F879E;
$line-color: #eee;

.recipe-detail {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px 16px 64px;
  text-align: left;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  color: $sub-text-color;
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    color: $point-color;
  }
}

.summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.hero {
  overflow: hidden;
  border-radius: 16px;
  aspect-ratio: 4 / 3;
  background-color: #f5f5f5;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category {
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 999px;
  background-color: $point-color;
  color: #fff;
  font-size: 0.85rem;
  font-weight: bold;
}

.name {
  margin: 0;
  font-size: 1.9rem;
  line-height: 1.3;
}

.description {
  margin: 0;
  color: $sub-text-color;
  font-size: 1rem;
  line-height: 1.6;
  word-break: keep-all;
}

.meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: 8px 0 0;
  padding: 14px 0;
  border-top: 1px solid $line-color;
  border-bottom: 1px solid $line-color;
  text-align: center;
}

.meta-item {
  dt {
    margin-bottom: 4px;
    color: $sub-text-color;
    font-size: 0.85rem;
  }

  dd {
    margin: 0;
    font-size: 1.05rem;
    font-weight: bold;
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
  margin-top: 36px;
}

.section-title {
  margin: 0 0 14px;
  padding-left: 10px;
  border-left: 4px solid $point-color;
  font-size: 1.35rem;
}

.ingredients {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ingredient {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px dashed $line-color;
  font-size: 1.05rem;
}

.ingredient-amount {
  color: $sub-text-color;
  white-space: nowrap;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.step {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 12px;
  background-color: #fffaf0;
}

.step-number {
  flex-shrink: 0;
  color: $point-color;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.2;
}

.step-body {
  flex: 1;
  min-width: 0;
}

.step-description {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.7;
  word-break: keep-all;
}

.step-image {
  display: block;
  width: 100%;
  max-width: 480px;
  margin-top: 12px;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .recipe-detail {
    padding-top: 24px;
  }

  .summary {
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 32px;
  }

  .name {
    font-size: 2.2rem;
  }

  .ingredients {
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
  }
}
</style>
