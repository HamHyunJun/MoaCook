<template>
    <div class="TodayFood">
        <div class="RecMenu">
            <h2>
                오늘의 추천 메뉴
                <img src="~/assets/images/TodayFood.png" alt="" class="title-icon">
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
@use '~/assets/scss/variables' as *;

.TodayFood {
    text-align: left;
}

.RecMenu h2 {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0 0 16px;
    font-size: 1.5rem;
}

.title-icon {
    width: 24px;
    height: 24px;
}

.Menu {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
}

.Menu-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: inherit;
    text-decoration: none;

    &:hover .explain {
        color: $point-color;
    }
}

.Menu-Image {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 8px;
    object-fit: cover;
}

.explain {
    padding: 0 4px;
    line-height: 1.5;
    word-break: keep-all;
}

@media (max-width: $mobile-max-width) {
    .RecMenu h2 {
        font-size: 1.25rem;
    }

    .Menu {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 12px;
    }

    .explain {
        font-size: 0.9rem;
    }
}
</style>
