<template>
  <div class="slider-wrapper">
    <div class="slider-container">
      <div class="slider">
        <div class="slides" :style="{ transform: 'translateX(' + slideOffset + 'vw)' }">
          <div v-for="(img, index) in images" :key="index" class="slide">
            <img :src="img" class="slide-img">
          </div>
        </div>
      </div>
    </div>
    <div class="sideImage">
      <img :src="sideImage" class="side-img">
    </div>
  </div>
</template>

<script setup lang="ts">
import slide01 from '~/assets/images/slide01.jpg'
import slide02 from '~/assets/images/slide02.jpg'
import slide03 from '~/assets/images/slide03.jpg'
import side1 from '~/assets/images/side1.jpg'

const images: string[] = [slide01, slide02, slide03]
const slideIndex = ref(0)
const slideWidth = 45 // 이미지 너비 (vw 단위)
const sideImage = side1

const slideOffset = computed<number>(() => -slideIndex.value * slideWidth)

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
.slider-wrapper {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2vh 5vw; 
  width: 100vw; 
  height: 50vh; 
  box-sizing: border-box;
  overflow: hidden; 
}

.slider-container {
  position: absolute;
  top: 0%;
  left: 15vw; 
  width: 45vw; 
  height: 50vh; 
  overflow: hidden;
}

.slides {
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 240vw; 
}

.slide {
  flex: 0 0 45vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide-img {
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.sideImage {
  position: absolute;
  top: 0%;
  left: 60vw; 
  width: 20vw; 
  height: 80vh; 
  overflow: hidden;
}

.side-img {
  max-width: 89.5%;
  max-height: 100%;
  object-fit: contain;
}
</style>