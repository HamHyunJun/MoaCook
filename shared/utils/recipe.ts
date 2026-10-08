import { RECIPE_CATEGORIES } from '../types/recipe'
import type { RecipeCategory, RecipeDifficulty } from '../types/recipe'

export function isRecipeCategory(value: unknown): value is RecipeCategory {
  return typeof value === 'string' && (RECIPE_CATEGORIES as readonly string[]).includes(value)
}

const MAX_DIFFICULTY = 3

/** 난이도를 별점 문자열로 변환 (예: 2 → "★★☆") */
export function formatDifficulty(difficulty: RecipeDifficulty): string {
  return '★'.repeat(difficulty) + '☆'.repeat(MAX_DIFFICULTY - difficulty)
}
