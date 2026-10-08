<template>
  <ul class="icon-menu">
    <li class="icon-item">
      <img src="~/assets/images/icon01.png" alt="" class="icon-image">
      <span>커뮤니티</span>
    </li>
    <li class="icon-item">
      <img src="~/assets/images/icon02.png" alt="" class="icon-image">
      <span>쇼핑하기</span>
    </li>
    <li class="icon-item">
      <img src="~/assets/images/icon03.png" alt="" class="icon-image">
      <span>쿠킹클래스</span>
    </li>
    <li class="icon-item">
      <img src="~/assets/images/icon04.png" alt="" class="icon-image">
      <span>질문하기</span>
    </li>
    <li class="icon-item">
      <img src="~/assets/images/icon05.png" alt="" class="icon-image">
      <span>이벤트</span>
    </li>
    <li class="icon-item">
      <img src="~/assets/images/icon06.png" alt="" class="icon-image">
      <span>공지사항</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.icon-menu {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.icon-image {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

@media (max-width: $mobile-max-width) {
  .icon-menu {
    grid-template-columns: repeat(3, 1fr);
    row-gap: 20px;
  }

  .icon-item {
    font-size: 0.85rem;
  }

  .icon-image {
    width: 44px;
    height: 44px;
  }
}
</style>
