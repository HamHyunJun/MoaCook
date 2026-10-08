/** 레시피 등록/수정/삭제와 이미지 업로드 요청 (목록·상세 조회는 페이지에서 useFetch 사용) */
export function useRecipes() {
  function recipeUrl(id: string): string {
    return `/api/recipes/${encodeURIComponent(id)}`
  }

  function createRecipe(input: RecipeInput): Promise<Recipe> {
    return $fetch<Recipe>('/api/recipes', { method: 'POST', body: input })
  }

  function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
    return $fetch<Recipe>(recipeUrl(id), { method: 'PUT', body: input })
  }

  async function deleteRecipe(id: string): Promise<void> {
    await $fetch(recipeUrl(id), { method: 'DELETE' })
  }

  function uploadImage(file: File): Promise<ImageUploadResult> {
    const formData = new FormData()
    formData.append('image', file)
    return $fetch<ImageUploadResult>('/api/uploads', { method: 'POST', body: formData })
  }

  return { createRecipe, updateRecipe, deleteRecipe, uploadImage }
}
