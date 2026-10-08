<template>
  <div id="app">
    <NuxtLoadingIndicator color="#F2542D" :height="3" :throttle="100" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@use '~/assets/scss/variables' as *;

*,
*::before,
*::after {
  box-sizing: border-box;
}

// 노치·상태 표시줄·하단 네비게이션바 영역 크기
// 안드로이드 앱(Capacitor)은 --safe-area-inset-* 변수로도 값을 넣어 주므로 둘 중 큰 값을 쓴다
:root {
  --safe-top: max(env(safe-area-inset-top, 0px), var(--safe-area-inset-top, 0px));
  --safe-bottom: max(env(safe-area-inset-bottom, 0px), var(--safe-area-inset-bottom, 0px));
}

body {
  margin: 0;
  background-color: $bg-color;
}

#app {
  min-height: 100vh;
  font-family: $font-family;
  font-size: $font-size-body;
  font-weight: 450;
  line-height: 1.6;
  word-break: keep-all;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text-color;
  letter-spacing: -0.011em;
}

h1,
h2,
h3 {
  font-weight: 750;
  letter-spacing: $tracking-snug;
}

button,
input,
select,
textarea {
  font-family: inherit;
}

// 데이터를 불러오는 동안 보여 주는 자리 표시 (반짝이며 지나가는 효과)
.skeleton {
  background: linear-gradient(90deg, $fill-color 25%, #E9EBEF 50%, $fill-color 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.2s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  from {
    background-position: 100% 0;
  }

  to {
    background-position: -100% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>
