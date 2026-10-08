<template>
  <header class="header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo" aria-label="MoaCook 홈">
        <img src="~/assets/images/MoaCook2.png" alt="MoaCook" class="logo-image">
      </NuxtLink>

      <form class="search-form" role="search" @submit.prevent="search">
        <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          v-model="keyword"
          type="search"
          class="search-input"
          placeholder="레시피, 재료 검색"
          aria-label="레시피 검색"
          maxlength="100"
        >
        <button type="submit" class="search-button">검색</button>
      </form>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const keyword = ref<string>('')

// 검색 결과 화면에서는 현재 검색어를 입력창에 보여 준다
watch(
  () => route.fullPath,
  () => {
    const q = route.query.q
    keyword.value = route.path === '/' && typeof q === 'string' ? q : ''
  },
  { immediate: true },
)

function search(): void {
  const q = keyword.value.trim()
  navigateTo({ path: '/', query: q ? { q } : {} })
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid $line-color;
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(12px);
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  max-width: $content-max-width;
  height: 72px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  flex-shrink: 0;
  display: block;
}

.logo-image {
  display: block;
  width: 96px;
  height: auto;
}

.search-form {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: $sub-text-color;
  stroke-width: 2;
  stroke-linecap: round;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 72px 0 44px;
  border: 1px solid transparent;
  border-radius: 999px;
  outline: none;
  background-color: #F2F3F5;
  color: $text-color;
  font-size: 0.95rem;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &::placeholder {
    color: $sub-text-color;
  }

  &:focus {
    border-color: $point-color;
    background-color: $surface-color;
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
}

.search-button {
  position: absolute;
  right: 5px;
  height: 34px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  background-color: $point-color;
  color: $text-color;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: $point-strong-color;
  }
}

@media (max-width: $mobile-max-width) {
  .header-inner {
    gap: 12px;
    height: 64px;
    padding: 0 16px;
  }

  .logo-image {
    width: 72px;
  }

  .search-input {
    height: 40px;
    font-size: 0.9rem;
  }

  .search-button {
    height: 30px;
    padding: 0 12px;
  }
}
</style>
