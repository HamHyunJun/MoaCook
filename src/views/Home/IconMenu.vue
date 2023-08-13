<template>
  <div class="icon-menu">
    <div class="icon-item">
      <img src="../../assets/images/icon01.png">
      <br>
      <a>커뮤니티</a>
    </div>
    <div class="icon-item">
      <img src="../../assets/images/icon02.png">
      <br>
      <a>쇼핑하기</a>
    </div>
    <div class="icon-item">
      <img src="../../assets/images/icon03.png">
      <br>
      <a>쿠킹클래스</a>
    </div>
    <div class="icon-item">
      <img src="../../assets/images/icon04.png">
      <br>
      <a>질문하기</a>
    </div>
    <div class="icon-item">
      <img src="../../assets/images/icon05.png">
      <br>
      <a>이벤트</a>
    </div>
    <div class="icon-item">
      <img src="../../assets/images/icon06.png">
      <br>
      <a>공지사항</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IconMenu',
};
</script>

<style scoped>
.icon-menu {
  position: absolute;
  top: 75vh;
  left: 14vw; 
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 9vw; 
  margin: 0 1vw; 
}
</style>