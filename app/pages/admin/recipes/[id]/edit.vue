<template>
  <div v-if="recipe" class="admin-page">
    <NuxtLink to="/admin/recipes" class="back-link">← 레시피 관리</NuxtLink>
    <h1 class="title">레시피 수정</h1>
    <RecipeForm
      :recipe="recipe"
      submit-label="수정 저장"
      :submitting="submitting"
      :server-errors="serverErrors"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = computed<string>(() => String(route.params.id))
const { updateRecipe } = useRecipes()

const { data: recipe, error } = await useFetch<Recipe>(() => `/api/recipes/${encodeURIComponent(id.value)}`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode ?? 500,
    statusMessage: error.value.statusCode === 404 ? '레시피를 찾을 수 없습니다.' : '레시피를 불러오지 못했습니다.',
    fatal: true,
  })
}

const submitting = ref(false)
const serverErrors = ref<string[]>([])

async function onSubmit(input: RecipeInput): Promise<void> {
  submitting.value = true
  serverErrors.value = []
  try {
    await updateRecipe(id.value, input)
    await navigateTo(`/recipes/${id.value}`)
  }
  catch (error: unknown) {
    serverErrors.value = getErrorMessages(error, '레시피를 수정하지 못했습니다.')
  }
  finally {
    submitting.value = false
  }
}

useHead({ title: () => `${recipe.value?.name ?? '레시피'} 수정 | MoaCook` })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/admin';
</style>
