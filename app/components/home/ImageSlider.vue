<template>
  <div class="slider-wrapper">
    <div class="slider-container">
      <div class="slides" :style="{ transform: `translateX(-${slideIndex * 100}%)` }">
        <div v-for="(img, index) in images" :key="index" class="slide">
          <img :src="img" :alt="`메인 배너 ${index + 1}`" class="slide-img">
        </div>
      </div>
    </div>
    <div class="side-image">
      <img :src="sideImage" alt="이벤트 배너" class="side-img">
    </div>
  </div>
</template>

<script setup lang="ts">
import slide01 from '~/assets/images/slide01.jpg'
import slide02 from '~/assets/images/slide02.jpg'
import slide03 from '~/assets/images/slide03.jpg'
import side1 from '~/assets/images/side1.jpg'

const images: string[] = [slide01, slide02, slide03]
const slideIndex = ref<number>(0)
const sideImage = side1

let timer: ReturnType<typeof setInterval> | undefined

function nextSlide(): void {
  slideIndex.value = (slideIndex.value + 1) % images.length
}

onMounted(() => {
  timer = setInterval(nextSlide, 3000) // 3초마다 슬라이드 변경
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.slider-wrapper {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 3fr);
  gap: 16px;
}

.slider-container {
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 16 / 9;
}

.slides {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  flex: 0 0 100%;
  height: 100%;
}

.slide-img,
.side-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.side-image {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

// 세로로 긴 배너가 슬라이더 높이를 늘리지 않도록 영역 안에 맞춘다
.side-img {
  position: absolute;
  inset: 0;
  object-position: top;
}

@media (max-width: $mobile-max-width) {
  .slider-wrapper {
    grid-template-columns: 1fr;
  }

  .side-image {
    display: none;
  }
}
</style>
