<template>
  <div style="height:1000px">
    <div class="slideShow">
      <br>
      <ImageSlider/>
      <IconMenu/>
      <TodayFood/>
      <BottomArea/>
    </div>
  </div>
</template>

<script>
import ImageSlider  from './ImageSlider.vue';
import IconMenu from './IconMenu.vue'
import TodayFood from './TodayFood.vue'
import BottomArea from './BottomArea.vue'

export default {
  name: 'HomeView', 
  components: {
    ImageSlider,
    IconMenu,
    TodayFood,
    BottomArea,
  },
  data() {
    return {
      
    }
  }
}
</script>

<style>

  .slideShow{
    height: 300px;
  }
  .slideLButton{
    position:absolute;
    top: 40%;
    left: 20%;
    cursor:pointer;
    background-color: transparent;    
    outline: none;
    border: none;
    border-radius: 100%;
  }
  .slideRButton{
    position:absolute;
    top: 40%;
    right: 20%;
    cursor:pointer;
    background-color: transparent;    
    outline: none;
    border: none;
    border-radius: 100%;
  }
</style>