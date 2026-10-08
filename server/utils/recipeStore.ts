import { randomUUID } from 'node:crypto'
import { seedRecipes } from '../data/recipes'

const RECIPE_PREFIX = 'items'
const SEEDED_KEY = 'seeded'
const RECIPE_ID_PATTERN = /^[\w-]{1,100}$/

let seeding: Promise<void> | undefined

function recipeStorage() {
  return useStorage('recipes')
}

function recipeKey(id: string): string {
  return `${RECIPE_PREFIX}:${id}`
}

/** 저장소를 처음 사용할 때 한 번만 초기 데이터를 넣는다 (모두 삭제해도 다시 채우지 않음) */
function ensureSeeded(): Promise<void> {
  seeding ??= (async () => {
    const storage = recipeStorage()
    if (await storage.hasItem(SEEDED_KEY)) return

    await Promise.all(seedRecipes.map(recipe => storage.setItem(recipeKey(recipe.id), recipe)))
    await storage.setItem(SEEDED_KEY, true)
  })().catch((error: unknown) => {
    seeding = undefined
    throw error
  })

  return seeding
}

/** 레시피 전체 조회 (등록 순서대로) */
export async function listRecipes(): Promise<Recipe[]> {
  await ensureSeeded()
  const storage = recipeStorage()
  const keys = await storage.getKeys(RECIPE_PREFIX)
  const recipes = await Promise.all(keys.map(key => storage.getItem<Recipe>(key)))

  return recipes
    .filter((recipe): recipe is Recipe => recipe !== null)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function findRecipe(id: string): Promise<Recipe | undefined> {
  if (!RECIPE_ID_PATTERN.test(id)) return undefined

  await ensureSeeded()
  return (await recipeStorage().getItem<Recipe>(recipeKey(id))) ?? undefined
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  await ensureSeeded()
  const now = new Date().toISOString()
  const recipe: Recipe = { ...input, id: randomUUID(), createdAt: now, updatedAt: now }

  await recipeStorage().setItem(recipeKey(recipe.id), recipe)
  return recipe
}

/** 레시피 수정, 없는 id면 undefined */
export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe | undefined> {
  const current = await findRecipe(id)
  if (!current) return undefined

  const recipe: Recipe = {
    ...input,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  }

  await recipeStorage().setItem(recipeKey(id), recipe)
  return recipe
}

/** 레시피 삭제, 삭제했으면 true */
export async function deleteRecipe(id: string): Promise<boolean> {
  const current = await findRecipe(id)
  if (!current) return false

  await recipeStorage().removeItem(recipeKey(id))
  return true
}

export function toRecipeSummary(recipe: Recipe): RecipeSummary {
  const { id, name, image, description, category, difficulty, cookingTime } = recipe
  return { id, name, image, description, category, difficulty, cookingTime }
}
