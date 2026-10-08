export default defineEventHandler(async (event): Promise<Recipe> => {
  await requireAdmin(event)

  const input = parseRecipeInput(await readBody(event))
  const recipe = await createRecipe(input)

  setResponseStatus(event, 201)
  return recipe
})
