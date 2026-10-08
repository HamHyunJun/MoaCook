export function isRecipeCategory(value: unknown): value is RecipeCategory {
  return typeof value === 'string' && (RECIPE_CATEGORIES as readonly string[]).includes(value)
}
