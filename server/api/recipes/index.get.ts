export default defineEventHandler((event): RecipeSummary[] => {
  const { category } = getQuery(event)
  const recipes = listRecipes()
  const filtered = isRecipeCategory(category)
    ? recipes.filter(recipe => recipe.category === category)
    : recipes

  return filtered.map(toRecipeSummary)
})
