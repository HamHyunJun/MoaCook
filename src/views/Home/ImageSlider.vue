<template>
  <div class="slider-wrapper">
    <div class="slider-container">
      <div class="slider">
        <div class="slides" :style="{ transform: 'translateX(' + slideOffset + 'vw)' }">
          <div class="slide" v-for="(img, index) in images" :key="index">
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

<script>
export default {
  name: 'ImageSlider',
  data() {
    return {
      images: [
        require('@/assets/images/slide01.jpg'),
        require('@/assets/images/slide02.jpg'),
        require('@/assets/images/slide03.jpg'),
      ],
      slideIndex: 0,
      slideWidth: 45, // 이미지 너비 (vw 단위)
      sideImageWidth: 20, // 사이드 이미지 너비 (vw 단위)
      sideImage: require('@/assets/images/side1.jpg'),
    };
  },
  computed: {
    slideOffset() {
      return -this.slideIndex * this.slideWidth;
    },
  },
  mounted() {
    setInterval(this.nextSlide, 3000); // 3초마다 슬라이드 변경
  },
  methods: {
    nextSlide() {
      this.slideIndex = (this.slideIndex + 1) % this.images.length;
    },
  },
};
</script>

<style scoped>
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