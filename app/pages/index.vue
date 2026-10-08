<template>
  <div class="recipe-list-page">
    <section class="intro">
      <div>
        <p class="eyebrow">{{ searchQuery.q ? '검색 결과' : 'MoaCook 레시피' }}</p>
        <h1 class="title">{{ title }}</h1>
        <p v-if="!searchQuery.q" class="subtitle">집에서 따라 하기 쉬운 레시피를 모았어요.</p>
      </div>
      <NuxtLink v-if="isAdmin" to="/admin/recipes/new" class="new-link">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        레시피 등록
      </NuxtLink>
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

    <div class="result-bar">
      <span v-if="loading" class="result-loading">레시피를 불러오는 중…</span>
      <span v-else>레시피 <strong>{{ recipes?.length ?? 0 }}</strong>개</span>
      <button v-if="searchQuery.q || hasFilter" type="button" class="reset-button" @click="resetQuery">조건 초기화</button>
    </div>

    <ul v-if="loading" class="recipe-grid" aria-hidden="true">
      <li v-for="index in 8" :key="index">
        <RecipeCardSkeleton />
      </li>
    </ul>
    <p v-else-if="error && !recipes" class="message">레시피를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
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

const toRouteQuery = (query: RecipeSearchQuery): Record<string, string> => {
  const result: Record<string, string> = {}
  if (query.q) result.q = query.q
  if (query.category) result.category = query.category
  if (query.difficulty) result.difficulty = String(query.difficulty)
  if (query.maxTime) result.maxTime = String(query.maxTime)
  return result
}

const { cache, lastListPath } = useRecipeList()
const nuxtApp = useNuxtApp()
const cacheKey = computed<string>(() => new URLSearchParams(toRouteQuery(searchQuery.value)).toString())

const { data: recipes, error, status, refresh } = await useFetch<RecipeSummary[]>('/api/recipes', {
  query: searchQuery,
  lazy: true,
  // 한 번 본 조건의 목록은 기억해 둔 것을 바로 보여 준다 (직접 새로고침할 때만 다시 받음)
  getCachedData: (key, app, { cause }) => {
    if (cause === 'refresh:manual') return undefined
    return app.isHydrating ? app.payload.data[key] : cache.value[cacheKey.value]
  },
})

const loading = computed<boolean>(() => !recipes.value && status.value === 'pending')

watch(recipes, (list) => {
  if (list) cache.value[cacheKey.value] = list
}, { immediate: true })

// 상세 화면의 '목록으로' 버튼이 이 주소(필터 포함)로 돌아올 수 있게 기억한다
watch(() => route.fullPath, (path) => {
  lastListPath.value = path
}, { immediate: true })

// 다른 화면에서 돌아왔을 때는 기억해 둔 목록을 먼저 보여 주고, 바뀐 내용이 있으면 뒤에서 받아 갱신한다
const restoredFromCache = !nuxtApp.isHydrating && Boolean(cache.value[cacheKey.value])
onMounted(() => {
  if (restoredFromCache) refresh()
})

/** 검색 조건을 URL 쿼리에 반영한다 (뒤로 가기 기록이 쌓이지 않도록 replace) */
const updateQuery = (patch: Partial<RecipeSearchQuery>): void => {
  navigateTo({ path: '/', query: toRouteQuery({ ...searchQuery.value, ...patch }) }, { replace: true })
}

const resetQuery = (): void => {
  navigateTo({ path: '/' }, { replace: true })
}

useHead({ title: () => (searchQuery.value.q || searchQuery.value.category ? `${title.value} | MoaCook` : 'MoaCook') })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.recipe-list-page {
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 48px 24px 40px;
  text-align: left;
}

.intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 32px;
}

.new-link {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  height: 44px;
  padding: 0 20px 0 16px;
  border-radius: 999px;
  background-color: $point-color;
  color: #fff;
  font-size: $font-size-small;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.15s ease;

  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2.5;
    stroke-linecap: round;
  }

  &:hover {
    background-color: $point-strong-color;
  }
}

.eyebrow {
  margin: 0 0 8px;
  color: $point-color;
  font-size: $font-size-small;
  font-weight: 750;
}

.title {
  margin: 0;
  font-size: $font-size-display;
  font-weight: 800;
  letter-spacing: $tracking-tight;
  line-height: 1.25;
  // 한글은 단어 단위로 줄을 바꾸고, 긴 검색어처럼 한 단어가 너무 길 때만 중간에서 끊는다
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.subtitle {
  margin: 10px 0 0;
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
  padding-bottom: 20px;
  border-bottom: 1px solid $line-color;
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
  height: 40px;
  padding: 0 18px;
  border: $border-width solid $line-color;
  border-radius: 999px;
  background-color: $surface-color;
  color: $text-color;
  font-size: $font-size-small;
  font-weight: 650;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: $line-strong-color;
  }

  &.active {
    border-color: $text-color;
    background-color: $text-color;
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid $point-color;
    outline-offset: 2px;
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
  margin: 20px 0;
  color: $sub-text-color;
  font-size: $font-size-small;
  font-weight: 500;

  strong {
    color: $text-color;
    font-weight: 750;
  }
}

.result-loading {
  color: $muted-text-color;
}

.reset-button {
  padding: 0;
  border: none;
  background: none;
  color: $sub-text-color;
  font-size: $font-size-small;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover {
    color: $text-color;
  }
}

.message {
  padding: 80px 0;
  border-radius: $radius-lg;
  background-color: $fill-color;
  color: $sub-text-color;
  font-weight: 500;
  text-align: center;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 40px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: $mobile-max-width) {
  .recipe-list-page {
    padding: 28px 16px 32px;
  }

  // 좁은 화면에서는 등록 버튼이 제목 영역을 좁히지 않도록 아래 줄로 내린다
  .intro {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .new-link {
    height: 40px;
    padding: 0 14px 0 12px;
    font-size: $font-size-caption;
  }

  .title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: $font-size-small;
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

  .chip {
    height: 38px;
    padding: 0 16px;
  }

  .select {
    flex: 1;
  }

  // 모바일은 2열로 촘촘하게 보여 줘야 한눈에 들어온다
  .recipe-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px 12px;
  }
}
</style>
