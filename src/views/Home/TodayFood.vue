<template>
    <div class="TodayFood">
        <div class="RecMenu">
            <h2>
                오늘의 추천 메뉴
                <img src="../../assets/images/TodayFood.png">
            </h2>
        </div>
        <div class="Menu">
            <div class="Menu-item">
                <img class="Menu-Image" src="../../assets/images/TodayFood01.jpg">
                <a class="explain">집에서 분식집 분위기 만들기! 어렵지 않아요!</a>
            </div>
            <div class="Menu-item">
                <img  class="Menu-Image" src="../../assets/images/TodayFood02.jpg">
                <a class="explain">한국인이 제일 사랑하는 음식! 제육복음 만들기</a>
            </div>
            <div class="Menu-item">
                <img  class="Menu-Image" src="../../assets/images/TodayFood03.jpg">
                <a class="explain">지치고 더운 여름날 몸보신하기 딱 좋은 음식! 오리고기 먹자!</a>
            </div>
            <div class="Menu-item">
                <img  class="Menu-Image" src="../../assets/images/TodayFood04.jpg">
                <a class="explain">남녀노소 누구나 좋아할 법한 디저트 만들기!</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.TodayFood {
    position: absolute;
    top: 86vh; 
    left: 14vw; 
    height: 35vh; 
    width: 65vw; 
}
.RecMenu {
    position: absolute;
    top: 1vh; 
    left: 2vw; 
}
.Menu {
    display: flex;
    position: absolute;
    height: 30vh; 
    top: 10vh; 
    left: 1vw; 
}
.Menu-item {
    display: inline-block;
    align-items: center;
    margin: 0 1vw; 
}
.Menu-Image{
    border-radius: 5%;
}
.explain{
    display: inline-block;
    text-overflow:ellipsis;
    word-break:keep-all;
    top: 70%;
    left: 10%;
    margin: 0 1vw; 
    text-align: left;
}
</style>