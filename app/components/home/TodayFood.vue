<template>
    <div class="TodayFood">
        <div class="RecMenu">
            <h2>
                오늘의 추천 메뉴
                <img src="~/assets/images/TodayFood.png">
            </h2>
        </div>
        <div class="Menu">
            <NuxtLink
                v-for="recipe in recommendedRecipes"
                :key="recipe.id"
                :to="`/recipes/${recipe.id}`"
                class="Menu-item"
            >
                <img class="Menu-Image" :src="recipe.image" :alt="recipe.name">
                <span class="explain">{{ recipe.description }}</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const RECOMMENDED_COUNT = 4

const { data: recipes } = await useFetch<RecipeSummary[]>('/api/recipes')

const recommendedRecipes = computed<RecipeSummary[]>(() => (recipes.value ?? []).slice(0, RECOMMENDED_COUNT))
</script>

<style lang="scss" scoped>
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
    color: inherit;
    text-decoration: none;
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