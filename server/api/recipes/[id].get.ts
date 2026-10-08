export default defineEventHandler((event): Recipe => {
  const id = getRouterParam(event, 'id')
  const recipe = id ? findRecipe(id) : undefined

  if (!recipe) {
    throw createError({ statusCode: 404, statusMessage: '레시피를 찾을 수 없습니다.' })
  }

  return recipe
})
