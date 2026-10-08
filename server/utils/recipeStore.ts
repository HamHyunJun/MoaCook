import { seedRecipes } from '../data/recipes'

/** 레시피 전체 조회 (현재는 초기 데이터, CRUD 단계에서 저장소 조회로 교체) */
export function listRecipes(): Recipe[] {
  return seedRecipes
}

export function toRecipeSummary(recipe: Recipe): RecipeSummary {
  const { id, name, image, description, category, difficulty, cookingTime } = recipe
  return { id, name, image, description, category, difficulty, cookingTime }
}
