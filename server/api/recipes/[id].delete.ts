export default defineEventHandler(async (event): Promise<void> => {
  await requireAdmin(event)

  const deleted = await deleteRecipe(getRouterParam(event, 'id') ?? '')

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: '레시피를 찾을 수 없습니다.' })
  }

  setResponseStatus(event, 204)
})
