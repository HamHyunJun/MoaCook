<template>
  <div class="admin-page">
    <div class="header">
      <h1 class="title">레시피 관리</h1>
      <NuxtLink to="/admin/recipes/new" class="new-button">+ 새 레시피 등록</NuxtLink>
    </div>

    <p v-if="error" class="message">레시피를 불러오지 못했습니다.</p>
    <p v-else-if="!recipes?.length" class="message">등록된 레시피가 없습니다.</p>
    <ul v-else class="recipe-list">
      <li v-for="recipe in recipes" :key="recipe.id" class="recipe-item">
        <img :src="recipe.image" :alt="recipe.name" class="thumbnail">
        <div class="info">
          <NuxtLink :to="`/recipes/${recipe.id}`" class="name">{{ recipe.name }}</NuxtLink>
          <span class="meta">{{ recipe.category }} · {{ formatDifficulty(recipe.difficulty) }} · {{ recipe.cookingTime }}분</span>
        </div>
        <div class="item-actions">
          <NuxtLink :to="`/admin/recipes/${recipe.id}/edit`" class="action">수정</NuxtLink>
          <button type="button" class="action action-danger" @click="deleteTarget = recipe">삭제</button>
        </div>
      </li>
    </ul>

    <p v-if="deleteError" class="delete-error" role="alert">{{ deleteError }}</p>

    <ConfirmDialog
      :open="deleteTarget !== null"
      :message="`'${deleteTarget?.name ?? ''}' 레시피를 정말 삭제하시겠습니까?`"
      confirm-label="삭제"
      :loading="deleting"
      @cancel="deleteTarget = null"
      @confirm="onConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
const { deleteRecipe } = useRecipes()

const { data: recipes, error, refresh } = await useFetch<RecipeSummary[]>('/api/recipes')

const deleteTarget = ref<RecipeSummary | null>(null)
const deleting = ref(false)
const deleteError = ref('')

async function onConfirmDelete(): Promise<void> {
  const target = deleteTarget.value
  if (!target) return

  deleting.value = true
  deleteError.value = ''
  try {
    await deleteRecipe(target.id)
    await refresh()
  }
  catch (error: unknown) {
    deleteError.value = getErrorMessage(error, '레시피를 삭제하지 못했습니다.')
  }
  finally {
    deleting.value = false
    deleteTarget.value = null
  }
}

useHead({ title: '레시피 관리 | MoaCook' })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

@use '~/assets/scss/admin';


.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;

  .title {
    margin: 0;
  }
}

.new-button {
  padding: 10px 16px;
  border-radius: 8px;
  background-color: $point-color;
  color: #fff;
  font-weight: bold;
  text-decoration: none;
}

.message {
  padding: 48px 0;
  color: $sub-text-color;
  text-align: center;
}

.recipe-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.recipe-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid $line-color;
}

.thumbnail {
  flex-shrink: 0;
  width: 72px;
  height: 54px;
  border-radius: 6px;
  object-fit: cover;
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.name {
  overflow: hidden;
  color: $text-color;
  font-weight: bold;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: $point-color;
  }
}

.meta {
  color: $sub-text-color;
  font-size: 0.85rem;
}

.item-actions {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
}

.action {
  padding: 8px 12px;
  border: 1px solid $line-color;
  border-radius: 8px;
  background-color: #fff;
  color: $text-color;
  font: inherit;
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
}

.action-danger {
  border-color: #f5c2bd;
  color: $error-color;
}

.delete-error {
  margin-top: 16px;
  color: $error-color;
}
</style>
