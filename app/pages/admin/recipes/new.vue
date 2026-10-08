<template>
  <div class="admin-page">
    <NuxtLink to="/admin/recipes" class="back-link">← 레시피 관리</NuxtLink>
    <h1 class="title">새 레시피 등록</h1>
    <RecipeForm
      submit-label="등록"
      :submitting="submitting"
      :server-errors="serverErrors"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { createRecipe } = useRecipes()

const submitting = ref(false)
const serverErrors = ref<string[]>([])

const onSubmit = async (input: RecipeInput): Promise<void> => {
  submitting.value = true
  serverErrors.value = []
  try {
    const recipe = await createRecipe(input)
    await navigateTo(`/recipes/${recipe.id}`)
  }
  catch (error: unknown) {
    serverErrors.value = getErrorMessages(error, '레시피를 등록하지 못했습니다.')
  }
  finally {
    submitting.value = false
  }
}

useHead({ title: '새 레시피 등록 | MoaCook' })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/admin';
</style>
