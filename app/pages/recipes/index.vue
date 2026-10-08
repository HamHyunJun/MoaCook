<template>
  <div />
</template>

<script setup lang="ts">
// 레시피 목록은 홈으로 옮겼다. 예전 주소(/recipes?...)는 검색 조건을 유지한 채 홈으로 보낸다
definePageMeta({
  redirect: to => ({ path: '/', query: to.query }),
})
</script>
