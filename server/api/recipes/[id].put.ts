export default defineEventHandler(async (event): Promise<Recipe> => {
  const input = parseRecipeInput(await readBody(event))
  const recipe = await updateRecipe(getRouterParam(event, 'id') ?? '', input)

  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: '레시피를 찾을 수 없습니다.' })
  }

  return recipe
})
