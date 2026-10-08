import { randomUUID } from 'node:crypto'
import { SEED_VERSION, seedRecipes } from '../data/recipes'

const RECIPE_ID_PATTERN = /^[\w-]{1,100}$/
/** 예전 초기 데이터가 쓰던 저해상도 이미지 경로 */
const LEGACY_SEED_IMAGE_PREFIX = '/images/recipes/'

let seeding: Promise<void> | undefined

/**
 * 초기 데이터를 저장소에 반영한다.
 * - 처음 사용할 때: 초기 레시피를 모두 넣는다.
 * - 초기 데이터 버전이 올라갔을 때: 새로 추가된 레시피만 넣고, 예전 저해상도 이미지를 쓰는 레시피는 이미지만 바꾼다.
 *   사용자가 수정하거나 삭제한 레시피는 그대로 둔다.
 */
function ensureSeeded(): Promise<void> {
  seeding ??= (async () => {
    const repository = recipeRepository()
    const appliedVersion = await repository.getSeedVersion()
    if (appliedVersion >= SEED_VERSION) return

    for (const { recipe, since } of seedRecipes) {
      const current = await repository.get(recipe.id)

      if (!current) {
        if (since > appliedVersion) await repository.save(recipe)
      }
      else if (current.image.startsWith(LEGACY_SEED_IMAGE_PREFIX)) {
        await repository.save({ ...current, image: recipe.image })
      }
    }

    await repository.setSeedVersion(SEED_VERSION)
  })().catch((error: unknown) => {
    seeding = undefined
    throw error
  })

  return seeding
}

/** 레시피 전체 조회 (등록 순서대로) */
export async function listRecipes(): Promise<Recipe[]> {
  await ensureSeeded()
  const recipes = await recipeRepository().list()
  return recipes.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export async function findRecipe(id: string): Promise<Recipe | undefined> {
  if (!RECIPE_ID_PATTERN.test(id)) return undefined

  await ensureSeeded()
  return recipeRepository().get(id)
}

export async function createRecipe(input: RecipeContent): Promise<Recipe> {
  await ensureSeeded()
  const now = new Date().toISOString()
  const recipe: Recipe = { ...input, id: randomUUID(), createdAt: now, updatedAt: now }

  await recipeRepository().save(recipe)
  return recipe
}

/** 레시피 수정, 없는 id면 undefined */
export async function updateRecipe(id: string, input: RecipeContent): Promise<Recipe | undefined> {
  const current = await findRecipe(id)
  if (!current) return undefined

  const recipe: Recipe = {
    ...input,
    id: current.id,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
  }

  await recipeRepository().save(recipe)
  return recipe
}

/** 레시피 삭제, 삭제했으면 true */
export async function deleteRecipe(id: string): Promise<boolean> {
  if (!RECIPE_ID_PATTERN.test(id)) return false

  await ensureSeeded()
  return recipeRepository().remove(id)
}

export function toRecipeSummary(recipe: Recipe): RecipeSummary {
  const { id, name, image, description, category, difficulty, cookingTime } = recipe
  return { id, name, image, description, category, difficulty, cookingTime }
}
