<template>
  <div class="layout">
    <HeaderComp />
    <main class="main">
      <slot />
    </main>
    <FooterComp />
  </div>
</template>

<script setup lang="ts">
// 관리자 로그인 여부를 서버 렌더링 때 한 번 받아 둔다 (관리 버튼 표시용)
const { ensureStatus } = useAdmin()
await callOnce('admin-status', ensureStatus)
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}
</style>
