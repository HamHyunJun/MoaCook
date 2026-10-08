<template>
  <article v-if="recipe" class="recipe-detail">
    <div class="top-bar">
      <NuxtLink :to="{ path: '/', query: { category: recipe.category } }" class="back-link">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        {{ recipe.category }} 레시피 목록
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
            <dd><DifficultyBadge :difficulty="recipe.difficulty" /></dd>
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
      <h2 id="ingredients-title" class="section-title">
        재료 <span class="section-count">{{ recipe.ingredients.length }}</span>
      </h2>
      <ul class="ingredients">
        <li v-for="ingredient in recipe.ingredients" :key="ingredient.id" class="ingredient">
          <span class="ingredient-name">{{ ingredient.name }}</span>
          <span class="ingredient-amount">{{ ingredient.amount }}</span>
        </li>
      </ul>
    </section>

    <section class="section" aria-labelledby="steps-title">
      <h2 id="steps-title" class="section-title">
        조리 과정 <span class="section-count">{{ sortedSteps.length }}</span>
      </h2>
      <ol class="steps">
        <li v-for="step in sortedSteps" :key="step.id" class="step">
          <span class="step-number" aria-hidden="true">{{ step.order }}</span>
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

useHead({ title: () => (recipe.value ? `${recipe.value.name} | MoaCook` : 'MoaCook') })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-detail {
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px 24px 40px;
  text-align: left;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: -4px;
  color: $sub-text-color;
  font-size: $font-size-small;
  font-weight: 600;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.25;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &:hover {
    color: $text-color;
  }
}

.edit-link {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  border: $border-width solid $line-color;
  border-radius: 999px;
  color: $text-color;
  font-size: $font-size-caption;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    border-color: $text-color;
  }
}

.summary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.hero {
  overflow: hidden;
  border-radius: $radius-lg;
  aspect-ratio: 4 / 3;
  background-color: $fill-color;
}

.hero-image {
  display: block;
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
  font-weight: 800;
  letter-spacing: $tracking-tight;
  line-height: 1.25;
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
  margin: 12px 0 0;
  padding: 18px 0;
  border: $border-width solid $line-color;
  border-radius: $radius-md;
  text-align: center;
}

.meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  dt {
    color: $sub-text-color;
    font-size: $font-size-caption;
    font-weight: 600;
  }

  dd {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 750;
    letter-spacing: $tracking-snug;
  }

  & + & {
    border-left: $border-width solid $line-color;
  }
}

.section {
  margin-top: 56px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px;
  font-size: $font-size-h2;
  font-weight: 800;
  letter-spacing: $tracking-snug;
}

.section-count {
  color: $point-color;
}

.ingredients {
  display: grid;
  grid-template-columns: 1fr;
  margin: 0;
  padding: 0;
  border-top: 2px solid $text-color;
  list-style: none;
}

.ingredient {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 4px;
  border-bottom: 1px solid $line-color;
  font-size: $font-size-body;
  font-weight: 600;
}

.ingredient-amount {
  color: $sub-text-color;
  font-weight: 500;
  white-space: nowrap;
}

.steps {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  border-top: 2px solid $text-color;
  list-style: none;
}

.step {
  display: flex;
  gap: 16px;
  padding: 24px 4px;
  border-bottom: 1px solid $line-color;
}

.step-number {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: $point-color;
  color: #fff;
  font-size: $font-size-small;
  font-weight: 800;
  letter-spacing: 0;
}

.step-body {
  flex: 1;
  min-width: 0;
  padding-top: 3px;
}

.step-description {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.7;
}

.step-image {
  display: block;
  width: 100%;
  max-width: 480px;
  margin-top: 14px;
  border-radius: $radius-md;
}

@media (min-width: $tablet-max-width) {
  .recipe-detail {
    padding-top: 32px;
  }

  .summary {
    grid-template-columns: 1.1fr 1fr;
    align-items: center;
    gap: 48px;
  }

  .name {
    font-size: $font-size-display;
  }

  .ingredients {
    grid-template-columns: 1fr 1fr;
    column-gap: 48px;
  }
}

@media (max-width: $mobile-max-width) {
  .recipe-detail {
    padding: 16px 16px 32px;
  }

  // 모바일은 사진을 화면 끝까지 넓혀 시원하게 보여 준다
  .hero {
    margin: 0 -16px;
    border-radius: 0;
  }

  .name {
    font-size: 1.75rem;
  }

  .description {
    font-size: 1rem;
  }

  .section {
    margin-top: 44px;
  }

  .step-description {
    font-size: 1rem;
  }
}
</style>
