<template>
  <div id="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
@use '~/assets/scss/variables' as *;

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: $bg-color;
}

#app {
  min-height: 100vh;
  font-family: $font-family;
  font-size: $font-size-body;
  font-weight: 450;
  line-height: 1.6;
  word-break: keep-all;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $text-color;
  letter-spacing: -0.011em;
}

h1,
h2,
h3 {
  font-weight: 750;
  letter-spacing: $tracking-snug;
}

button,
input,
select,
textarea {
  font-family: inherit;
}
</style>
