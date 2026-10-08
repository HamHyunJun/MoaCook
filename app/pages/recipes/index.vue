<template>
  <div class="recipe-list-page">
    <h2 class="title">{{ title }}</h2>

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
        <label class="select-field">
          <span class="select-label">난이도</span>
          <select :value="searchQuery.difficulty ?? ''" @change="onDifficultyChange">
            <option value="">전체</option>
            <option v-for="option in DIFFICULTY_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </label>
        <label class="select-field">
          <span class="select-label">조리시간</span>
          <select :value="searchQuery.maxTime ?? ''" @change="onMaxTimeChange">
            <option value="">전체</option>
            <option v-for="minutes in maxTimeOptions" :key="minutes" :value="minutes">
              {{ minutes }}분 이내
            </option>
          </select>
        </label>
      </div>
    </div>

    <div v-if="searchQuery.q || hasFilter" class="result-bar">
      <span class="result-count">{{ recipes?.length ?? 0 }}개의 레시피</span>
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

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: 1, label: '쉬움 ★' },
  { value: 2, label: '보통 ★★' },
  { value: 3, label: '어려움 ★★★' },
]
const MAX_TIME_OPTIONS: number[] = [15, 30, 60]

const route = useRoute()

const searchQuery = computed<RecipeSearchQuery>(() => parseRecipeSearchQuery(route.query))

const hasFilter = computed<boolean>(() =>
  Boolean(searchQuery.value.category || searchQuery.value.difficulty || searchQuery.value.maxTime),
)

// 주소로 직접 들어온 조리시간 값도 선택 상태로 보이도록 목록에 포함한다
const maxTimeOptions = computed<number[]>(() => {
  const current = searchQuery.value.maxTime
  return current && !MAX_TIME_OPTIONS.includes(current)
    ? [...MAX_TIME_OPTIONS, current].sort((a, b) => a - b)
    : MAX_TIME_OPTIONS
})

const title = computed<string>(() => {
  const { q, category } = searchQuery.value
  if (q) return `'${q}' 검색 결과`
  return category ? `${category} 레시피` : '전체 레시피'
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
  navigateTo({ path: '/recipes', query: toRouteQuery({ ...searchQuery.value, ...patch }) }, { replace: true })
}

function resetQuery(): void {
  navigateTo({ path: '/recipes' }, { replace: true })
}

function readSelectNumber(event: Event): number | undefined {
  const value = Number((event.target as HTMLSelectElement).value)
  return value > 0 ? value : undefined
}

function onDifficultyChange(event: Event): void {
  const value = readSelectNumber(event)
  updateQuery({ difficulty: isRecipeDifficulty(value) ? value : undefined })
}

function onMaxTimeChange(event: Event): void {
  updateQuery({ maxTime: readSelectNumber(event) })
}

useHead({ title: () => `${title.value} | MoaCook` })
</script>

<style lang="scss" scoped>
$point-color: #FFBD59;
$sub-text-color: #7F879E;

.recipe-list-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  text-align: left;
}

.title {
  margin: 0 0 16px;
  font-size: 1.5rem;
  word-break: break-all;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 6px 14px;
  border: 1px solid #ddd;
  border-radius: 999px;
  background-color: #fff;
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    border-color: $point-color;
  }

  &.active {
    border-color: $point-color;
    background-color: $point-color;
    color: #fff;
    font-weight: bold;
  }
}

.selects {
  display: flex;
  gap: 12px;
}

.select-field {
  display: flex;
  align-items: center;
  gap: 6px;

  select {
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    font-size: 0.9rem;
  }
}

.select-label {
  color: $sub-text-color;
  font-size: 0.85rem;
  white-space: nowrap;
}

.result-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: $sub-text-color;
  font-size: 0.9rem;
}

.reset-button {
  padding: 0;
  border: none;
  background: none;
  color: $sub-text-color;
  font-size: 0.9rem;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: $point-color;
  }
}

.message {
  padding: 48px 0;
  color: $sub-text-color;
  text-align: center;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 600px) {
  .recipe-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
