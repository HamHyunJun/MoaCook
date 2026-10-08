export default defineEventHandler(async (event): Promise<Recipe> => {
  const recipe = await findRecipe(getRouterParam(event, 'id') ?? '')

  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: '레시피를 찾을 수 없습니다.' })
  }

  return recipe
})
