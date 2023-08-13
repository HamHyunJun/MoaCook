<template>
  <div id="app">
    <div>
      <HeaderComp></HeaderComp>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderComp from "./views/page/HeaderComp.vue"

export default {
  name: 'App',
  components: {
    HeaderComp
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin : 0;
  
}
</style>
