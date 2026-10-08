export default defineEventHandler(async (event): Promise<RecipeSummary[]> => {
  const { category } = getQuery(event)
  const recipes = await listRecipes()
  const filtered = isRecipeCategory(category)
    ? recipes.filter(recipe => recipe.category === category)
    : recipes

  return filtered.map(toRecipeSummary)
})
