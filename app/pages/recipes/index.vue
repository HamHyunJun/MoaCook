<template>
  <div class="recipe-list-page">
    <h2 class="title">{{ title }}</h2>

    <p v-if="error" class="message">레시피를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
    <p v-else-if="!recipes?.length" class="message">등록된 레시피가 없습니다.</p>
    <ul v-else class="recipe-grid">
      <li v-for="recipe in recipes" :key="recipe.id">
        <RecipeCard :recipe="recipe" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const category = computed<RecipeCategory | undefined>(() => {
  const value = route.query.category
  return isRecipeCategory(value) ? value : undefined
})

const title = computed<string>(() => (category.value ? `${category.value} 레시피` : '전체 레시피'))

const { data: recipes, error } = await useFetch<RecipeSummary[]>('/api/recipes', {
  query: { category },
})

useHead({ title: () => `${title.value} | MoaCook` })
</script>

<style lang="scss" scoped>
.recipe-list-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  text-align: left;
}

.title {
  margin: 0 0 20px;
  font-size: 1.5rem;
}

.message {
  padding: 48px 0;
  color: #7F879E;
  text-align: center;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 600px) {
  .recipe-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
