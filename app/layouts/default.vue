<template>
  <div class="layout">
    <HeaderComp />
    <main class="main">
      <slot />
    </main>
    <FooterComp />
    <!-- 앱에서 하단 네비게이션바 뒤로 내용이 비쳐 겹쳐 보이지 않도록 그 영역을 흰색으로 가린다 -->
    <div class="safe-area-bottom" aria-hidden="true" />
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

.safe-area-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 30;
  height: var(--safe-bottom);
  background-color: #fff;
  pointer-events: none;
}
</style>
