const normalize = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '')
}

/** 검색어는 이름, 설명, 재료 이름에서 띄어쓰기를 무시하고 찾는다 */
const matchesKeyword = (recipe: Recipe, keyword: string): boolean => {
  const target = normalize(keyword)
  const fields = [recipe.name, recipe.description, ...recipe.ingredients.map(ingredient => ingredient.name)]

  return fields.some(field => normalize(field).includes(target))
}

export const filterRecipes = (recipes: Recipe[], query: RecipeSearchQuery): Recipe[] => {
  return recipes.filter(recipe =>
    (!query.q || matchesKeyword(recipe, query.q))
    && (!query.category || recipe.category === query.category)
    && (!query.difficulty || recipe.difficulty === query.difficulty)
    && (!query.maxTime || recipe.cookingTime <= query.maxTime),
  )
}
