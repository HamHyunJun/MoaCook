export default defineEventHandler(async (event): Promise<RecipeSummary[]> => {
  const query = parseRecipeSearchQuery(getQuery(event))
  const recipes = await listRecipes()

  return filterRecipes(recipes, query).map(toRecipeSummary)
})
