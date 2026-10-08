<template>
  <div class="recipe-list-page">
    <section class="intro">
      <NuxtLink v-if="isAdmin" to="/admin/recipes/new" class="new-link">+ 레시피 등록</NuxtLink>
      <p class="eyebrow">{{ searchQuery.q ? '검색' : 'MoaCook 레시피' }}</p>
      <h1 class="title">{{ title }}</h1>
      <p v-if="!searchQuery.q" class="subtitle">집에서 따라 하기 쉬운 레시피를 모았어요.</p>
    </section>

    <div class="filters">
      <div class="category-chips" role="group" aria-label="카테고리">
        <button
          type="button"
          class="chip"
          :class="{ active: !searchQuery.category }"
          :aria-pressed="!searchQuery.category"
          @click="updateQuery({ category: undefined })"
        >
          전체
        </button>
        <button
          v-for="category in RECIPE_CATEGORIES"
          :key="category"
          type="button"
          class="chip"
          :class="{ active: searchQuery.category === category }"
          :aria-pressed="searchQuery.category === category"
          @click="updateQuery({ category })"
        >
          {{ category }}
        </button>
      </div>

      <div class="selects">
        <SelectDropdown
          :model-value="searchQuery.difficulty"
          :options="DIFFICULTY_OPTIONS"
          label="난이도"
          all-label="난이도 전체"
          class="select"
          @update:model-value="difficulty => updateQuery({ difficulty })"
        />
        <SelectDropdown
          :model-value="searchQuery.maxTime"
          :options="maxTimeOptions"
          label="조리시간"
          all-label="조리시간 전체"
          class="select"
          @update:model-value="maxTime => updateQuery({ maxTime })"
        />
      </div>
    </div>

    <div v-if="searchQuery.q || hasFilter" class="result-bar">
      <span><strong>{{ recipes?.length ?? 0 }}</strong>개의 레시피</span>
      <button type="button" class="reset-button" @click="resetQuery">조건 초기화</button>
    </div>

    <p v-if="error" class="message">레시피를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
    <p v-else-if="!recipes?.length" class="message">
      {{ searchQuery.q || hasFilter ? '조건에 맞는 레시피가 없습니다.' : '등록된 레시피가 없습니다.' }}
    </p>
    <ul v-else class="recipe-grid">
      <li v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard :recipe="recipe" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface DifficultyOption {
  value: RecipeDifficulty
  label: string
}

interface MaxTimeOption {
  value: number
  label: string
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: 1, label: '쉬움' },
  { value: 2, label: '보통' },
  { value: 3, label: '어려움' },
]
const MAX_TIME_OPTIONS: number[] = [15, 30, 60]

const route = useRoute()
const { isAdmin } = useAdmin()

const searchQuery = computed<RecipeSearchQuery>(() => parseRecipeSearchQuery(route.query))

const hasFilter = computed<boolean>(() =>
  Boolean(searchQuery.value.category || searchQuery.value.difficulty || searchQuery.value.maxTime),
)

// 주소로 직접 들어온 조리시간 값도 선택 상태로 보이도록 목록에 포함한다
const maxTimeOptions = computed<MaxTimeOption[]>(() => {
  const current = searchQuery.value.maxTime
  const minutes = current && !MAX_TIME_OPTIONS.includes(current)
    ? [...MAX_TIME_OPTIONS, current].sort((a, b) => a - b)
    : MAX_TIME_OPTIONS
  return minutes.map(value => ({ value, label: `${value}분 이내` }))
})

const title = computed<string>(() => {
  const { q, category } = searchQuery.value
  if (q) return `'${q}' 검색 결과`
  return category ? `${category} 레시피` : '오늘은 뭘 만들어 볼까요?'
})

const { data: recipes, error } = await useFetch<RecipeSummary[]>('/api/recipes', {
  query: searchQuery,
})

function toRouteQuery(query: RecipeSearchQuery): Record<string, string> {
  const result: Record<string, string> = {}
  if (query.q) result.q = query.q
  if (query.category) result.category = query.category
  if (query.difficulty) result.difficulty = String(query.difficulty)
  if (query.maxTime) result.maxTime = String(query.maxTime)
  return result
}

/** 검색 조건을 URL 쿼리에 반영한다 (뒤로 가기 기록이 쌓이지 않도록 replace) */
function updateQuery(patch: Partial<RecipeSearchQuery>): void {
  navigateTo({ path: '/', query: toRouteQuery({ ...searchQuery.value, ...patch }) }, { replace: true })
}

function resetQuery(): void {
  navigateTo({ path: '/' }, { replace: true })
}

useHead({ title: () => (searchQuery.value.q || searchQuery.value.category ? `${title.value} | MoaCook` : 'MoaCook') })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-list-page {
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 40px 20px 80px;
  text-align: left;
}

.intro {
  position: relative;
  margin-bottom: 28px;
}

.new-link {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 18px;
  border-radius: 999px;
  background-color: $text-color;
  color: #fff;
  font-size: $font-size-small;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background-color: #000;
  }
}

.eyebrow {
  display: inline-block;
  margin: 0 0 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: $point-soft-color;
  color: $point-strong-color;
  font-size: $font-size-caption;
  font-weight: 700;
  letter-spacing: 0;
}

.title {
  margin: 0;
  font-size: $font-size-display;
  font-weight: 820;
  letter-spacing: $tracking-tight;
  line-height: 1.2;
  word-break: break-all;
}

.subtitle {
  margin: 12px 0 0;
  color: $sub-text-color;
  font-size: 1.0625rem;
  font-weight: 500;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.category-chips {
  display: flex;
  gap: 8px;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.chip {
  flex-shrink: 0;
  padding: 9px 18px;
  border: 1px solid $line-color;
  border-radius: 999px;
  background-color: $surface-color;
  color: $text-color;
  font-size: $font-size-small;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: $point-color;
  }

  &.active {
    border-color: $text-color;
    background-color: $text-color;
    color: #fff;
  }
}

.selects {
  display: flex;
  gap: 8px;
}

.result-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: $sub-text-color;
  font-size: 0.9rem;

  strong {
    color: $text-color;
  }
}

.reset-button {
  padding: 0;
  border: none;
  background: none;
  color: $sub-text-color;
  font-size: 0.9rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover {
    color: $text-color;
  }
}

.message {
  padding: 64px 0;
  border-radius: $radius-lg;
  background-color: $surface-color;
  color: $sub-text-color;
  text-align: center;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 28px 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: $mobile-max-width) {
  .recipe-list-page {
    padding: 24px 16px 64px;
  }

  .title {
    font-size: 1.875rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  // 줄바꿈을 끄지 않으면 세로 배치에서 칩 줄 길이만큼 너비가 늘어난다
  .filters {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  // 칩은 화면 끝까지 밀어서 볼 수 있도록 좌우 여백을 넘긴다
  .category-chips {
    margin: 0 -16px;
    padding: 0 16px;
  }

  .select {
    flex: 1;
  }

  .recipe-grid {
    gap: 24px;
  }
}
</style>
