<template>
<div class="square">
    <div>
        <h3 class="box">Box Test</h3>
    </div>
</div>
    
</template>

<style>
.square {
  position: relative;
  width: 50%;
  height: 50%;
}

.square:after {
  content: "";
  display: block;
  padding-bottom: 100%;
}

.content {
  position: absolute;
  width: 100%;
  height: 100%;
}
.box{
    border: 30px solid #DB882E;
    height: 100%;
    width: 100%;
}
</style>