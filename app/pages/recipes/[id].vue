<template>
  <article class="recipe-detail">
    <div class="top-bar">
      <a :href="backHref" class="back-link" @click.prevent="goBack">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        레시피 목록
      </a>
      <NuxtLink v-if="isAdmin && recipe" :to="`/admin/recipes/${recipe.id}/edit`" class="edit-link">수정하기</NuxtLink>
    </div>

    <!-- 목록에서 넘어올 때는 목록에 있던 사진·이름을 먼저 보여 주고, 나머지는 받는 동안 자리 표시를 둔다 -->
    <header v-if="summary" class="summary">
      <div class="hero">
        <img :src="summary.image" :alt="summary.name" class="hero-image">
      </div>
      <div class="summary-body">
        <span class="category">{{ summary.category }}</span>
        <h1 class="name">{{ summary.name }}</h1>
        <p class="description">{{ summary.description }}</p>
        <dl class="meta">
          <div class="meta-item">
            <dt>난이도</dt>
            <dd><DifficultyBadge :difficulty="summary.difficulty" /></dd>
          </div>
          <div class="meta-item">
            <dt>조리시간</dt>
            <dd>{{ summary.cookingTime }}분</dd>
          </div>
          <div class="meta-item">
            <dt>재료</dt>
            <dd v-if="recipe">{{ recipe.ingredients.length }}가지</dd>
            <dd v-else><span class="skeleton meta-skeleton" /></dd>
          </div>
        </dl>
      </div>
    </header>
    <header v-else class="summary" aria-hidden="true">
      <div class="hero skeleton" />
      <div class="summary-body">
        <span class="skeleton text-skeleton" style="width: 56px" />
        <span class="skeleton text-skeleton title-skeleton" />
        <span class="skeleton text-skeleton" />
        <span class="skeleton text-skeleton" style="width: 60%" />
      </div>
    </header>

    <template v-if="recipe">
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
    </template>
    <div v-else class="section" aria-hidden="true">
      <span class="skeleton text-skeleton title-skeleton" style="width: 120px" />
      <div class="rows-skeleton">
        <span v-for="index in 6" :key="index" class="skeleton row-skeleton" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { isAdmin } = useAdmin()
const { lastListPath, findSummary } = useRecipeList()
const id = computed<string>(() => String(route.params.id))

// 데이터를 받는 동안에도 바로 화면을 넘기고 자리 표시를 보여 준다 (서버 렌더링 때는 다 받은 뒤 그린다)
const { data: recipe, error } = await useFetch<Recipe>(() => `/api/recipes/${encodeURIComponent(id.value)}`, {
  lazy: true,
})

const summary = computed<RecipeSummary | undefined>(() => recipe.value ?? findSummary(id.value))

const toPageError = (statusCode: number | undefined) => {
  return createError({
    statusCode: statusCode ?? 500,
    statusMessage: statusCode === 404 ? '레시피를 찾을 수 없습니다.' : '레시피를 불러오지 못했습니다.',
    fatal: true,
  })
}

if (error.value) throw toPageError(error.value.statusCode)

watch(error, (value) => {
  if (value) showError(toPageError(value.statusCode))
})

const sortedSteps = computed<RecipeStep[]>(() =>
  [...(recipe.value?.steps ?? [])].sort((a, b) => a.order - b.order),
)

// 목록에서 들어왔다면 브라우저 뒤로 가기로 돌아가서 필터와 스크롤 위치를 그대로 살린다.
// 주소로 바로 들어왔다면 마지막으로 본 목록(없으면 전체 목록)으로 이동한다.
const backHref = computed<string>(() => lastListPath.value)

const goBack = (): void => {
  const back = router.options.history.state.back
  if (typeof back === 'string' && back.split('?')[0] === '/') {
    router.back()
    return
  }
  navigateTo(lastListPath.value)
}

useHead({ title: () => (summary.value ? `${summary.value.name} | MoaCook` : 'MoaCook') })
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

.meta-skeleton {
  display: inline-block;
  width: 40px;
  height: 18px;
  border-radius: 6px;
  vertical-align: middle;
}

.text-skeleton {
  display: block;
  height: 16px;
  border-radius: 6px;
}

.title-skeleton {
  width: 50%;
  height: 34px;
}

.rows-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.row-skeleton {
  display: block;
  height: 48px;
  border-radius: $radius-md;
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
