<template>
  <header class="header">
    <div class="header-inner">
      <NuxtLink to="/" class="logo" aria-label="MoaCook 홈">
        <AppLogo />
      </NuxtLink>

      <form class="search-form" role="search" @submit.prevent="search">
        <button type="submit" class="search-button" aria-label="검색">
          <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
        <input
          v-model="keyword"
          type="search"
          class="search-input"
          placeholder="레시피, 재료 검색"
          aria-label="레시피 검색"
          maxlength="100"
        >
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
  padding-top: env(safe-area-inset-top);
  border-bottom: 1px solid $line-color;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(12px);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: $content-max-width;
  height: 68px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo {
  flex-shrink: 0;
  font-size: 1.375rem;
  text-decoration: none;

  &:focus-visible {
    border-radius: $radius-sm;
    outline: 2px solid $point-color;
    outline-offset: 4px;
  }
}

.search-form {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 440px;
  margin-left: auto;
}

.search-button {
  position: absolute;
  left: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  cursor: pointer;

  &:hover .search-icon {
    stroke: $text-color;
  }
}

.search-icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: $sub-text-color;
  stroke-width: 2.25;
  stroke-linecap: round;
  transition: stroke 0.15s ease;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 18px 0 42px;
  border: $border-width solid transparent;
  border-radius: 999px;
  outline: none;
  background-color: $fill-color;
  color: $text-color;
  font-size: $font-size-small;
  font-weight: 500;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  &::placeholder {
    color: $muted-text-color;
  }

  &:focus {
    border-color: $text-color;
    background-color: $surface-color;
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
}

@media (max-width: $mobile-max-width) {
  .header-inner {
    gap: 14px;
    height: 60px;
    padding: 0 16px;
  }

  .logo {
    font-size: 1.125rem;
  }

  .search-form {
    max-width: none;
  }

  .search-input {
    height: 40px;
  }
}
</style>
