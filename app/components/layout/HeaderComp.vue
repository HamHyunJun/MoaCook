<template>
  <header class="header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo" aria-label="MoaCook 홈">
        <img src="~/assets/images/MoaCook2.png" alt="MoaCook" class="logo-image">
      </NuxtLink>

      <form class="search-form" role="search" @submit.prevent="search">
        <input
          v-model="keyword"
          type="search"
          class="search-input"
          placeholder="통합검색"
          aria-label="레시피 검색"
          maxlength="100"
        >
        <button type="submit" class="search-button">
          <img class="search-icon" src="~/assets/images/search.png" alt="검색">
        </button>
      </form>

      <ul class="menu-list">
        <li class="menu-item">로그인</li>
        <li class="menu-item">회원가입</li>
      </ul>

      <nav class="nav" aria-label="카테고리">
        <ul class="nav-list">
          <li v-for="category in RECIPE_CATEGORIES" :key="category">
            <NuxtLink
              :to="{ path: '/recipes', query: { category } }"
              class="nav-link"
              :class="{ active: currentCategory === category }"
            >
              {{ category }} 조리법
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const keyword = ref<string>('')

const currentCategory = computed<RecipeCategory | undefined>(() => {
  const category = route.query.category
  return route.path === '/recipes' && isRecipeCategory(category) ? category : undefined
})

// 검색 결과 화면에서는 현재 검색어를 입력창에 보여 준다
watch(
  () => route.fullPath,
  () => {
    const q = route.query.q
    keyword.value = route.path === '/recipes' && typeof q === 'string' ? q : ''
  },
  { immediate: true },
)

function search(): void {
  const q = keyword.value.trim()
  navigateTo({ path: '/recipes', query: q ? { q } : {} })
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.header {
  border-bottom: 2px solid $point-color;
  background-color: #fff;
}

.header-inner {
  display: grid;
  grid-template-areas:
    'logo search account'
    'logo nav nav';
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 48px;
  row-gap: 16px;
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 20px 16px;
}

.logo {
  grid-area: logo;
  display: block;
}

.logo-image {
  display: block;
  width: 150px;
  height: auto;
}

.search-form {
  grid-area: search;
  position: relative;
  width: 100%;
  max-width: 360px;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 48px 0 16px;
  border: 1px solid $sub-text-color;
  border-radius: 999px;
  outline: none;
  font-size: 0.9rem;
  box-sizing: border-box;

  &:focus {
    border-color: $point-color;
  }
}

.search-button {
  position: absolute;
  top: 50%;
  right: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: $point-color;
  cursor: pointer;
  transform: translateY(-50%);
}

.search-icon {
  width: 18px;
  height: 18px;
}

.menu-list {
  grid-area: account;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.menu-item {
  color: $sub-text-color;
  font-size: 0.85rem;
  font-weight: 500;
}

.nav {
  grid-area: nav;
}

.nav-list {
  display: flex;
  gap: 40px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-link {
  color: #000;
  font-size: 1.05rem;
  font-weight: bold;
  text-decoration: none;
  white-space: nowrap;

  &:hover,
  &.active {
    color: $point-color;
  }
}

@media (max-width: $tablet-max-width) {
  .header-inner {
    grid-template-areas:
      'logo account'
      'search search'
      'nav nav';
    grid-template-columns: auto auto;
    justify-content: space-between;
    row-gap: 12px;
    padding: 12px 16px;
  }

  .logo-image {
    width: 96px;
  }

  .search-form {
    max-width: none;
  }

  // 카테고리가 화면보다 길면 가로로 밀어서 본다
  .nav {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .nav-list {
    gap: 24px;
    padding-bottom: 4px;
  }

  .nav-link {
    font-size: 0.95rem;
  }
}
</style>
