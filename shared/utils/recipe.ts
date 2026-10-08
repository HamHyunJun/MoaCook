import { RECIPE_CATEGORIES } from '../types/recipe'
import type { RecipeCategory } from '../types/recipe'

export function isRecipeCategory(value: unknown): value is RecipeCategory {
  return typeof value === 'string' && (RECIPE_CATEGORIES as readonly string[]).includes(value)
}
