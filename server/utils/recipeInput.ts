import { randomUUID } from 'node:crypto'

const MAX_NAME_LENGTH = 100
const MAX_TEXT_LENGTH = 2000
const MAX_COOKING_TIME = 24 * 60
const MAX_LIST_LENGTH = 100

type JsonObject = Record<string, unknown>

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() : undefined
}

/**
 * 등록/수정 요청 본문(RecipeInput)을 검증해 RecipeContent로 변환한다.
 * 잘못된 항목이 있으면 모든 오류 메시지를 담아 400 오류를 던진다.
 */
export function parseRecipeInput(body: unknown): RecipeContent {
  const errors: string[] = []

  if (!isObject(body)) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: '요청 형식이 올바르지 않습니다.' })
  }

  const name = readString(body.name)
  if (!name || name.length > MAX_NAME_LENGTH) {
    errors.push(`요리 이름을 1~${MAX_NAME_LENGTH}자로 입력해 주세요.`)
  }

  const image = readString(body.image)
  if (!image) {
    errors.push('대표 이미지를 등록해 주세요.')
  }

  const description = readString(body.description)
  if (!description || description.length > MAX_TEXT_LENGTH) {
    errors.push(`설명을 1~${MAX_TEXT_LENGTH}자로 입력해 주세요.`)
  }

  const { category, difficulty, cookingTime } = body
  if (!isRecipeCategory(category)) {
    errors.push(`카테고리는 ${RECIPE_CATEGORIES.join(', ')} 중 하나여야 합니다.`)
  }
  if (!isRecipeDifficulty(difficulty)) {
    errors.push('난이도는 1~3 중 하나여야 합니다.')
  }
  if (typeof cookingTime !== 'number' || !Number.isInteger(cookingTime) || cookingTime < 1 || cookingTime > MAX_COOKING_TIME) {
    errors.push(`조리 시간은 1~${MAX_COOKING_TIME}분 사이의 정수여야 합니다.`)
  }

  const ingredients = parseIngredients(body.ingredients, errors)
  const steps = parseSteps(body.steps, errors)

  const youtubeQuery = body.youtubeQuery === undefined ? undefined : readString(body.youtubeQuery)
  if (body.youtubeQuery !== undefined && (youtubeQuery === undefined || youtubeQuery.length > MAX_NAME_LENGTH)) {
    errors.push(`유튜브 검색 키워드는 ${MAX_NAME_LENGTH}자 이하의 문자열이어야 합니다.`)
  }

  if (errors.length > 0 || !name || !image || !description || !isRecipeCategory(category) || !isRecipeDifficulty(difficulty) || typeof cookingTime !== 'number') {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: errors[0], data: { errors } })
  }

  return {
    name,
    image,
    description,
    category,
    difficulty,
    cookingTime,
    ingredients,
    steps,
    ...(youtubeQuery ? { youtubeQuery } : {}),
  }
}

function parseIngredients(value: unknown, errors: string[]): RecipeIngredient[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_LIST_LENGTH) {
    errors.push(`재료를 1~${MAX_LIST_LENGTH}개 입력해 주세요.`)
    return []
  }

  return value.flatMap((item: unknown, index): RecipeIngredient[] => {
    const name = isObject(item) ? readString(item.name) : undefined
    const amount = isObject(item) ? readString(item.amount) : undefined

    if (!isObject(item) || !name || name.length > MAX_NAME_LENGTH || amount === undefined || amount.length > MAX_NAME_LENGTH) {
      errors.push(`${index + 1}번째 재료의 이름과 분량을 확인해 주세요.`)
      return []
    }

    return [{ id: readString(item.id) || randomUUID(), name, amount }]
  })
}

function parseSteps(value: unknown, errors: string[]): RecipeStep[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_LIST_LENGTH) {
    errors.push(`조리 과정을 1~${MAX_LIST_LENGTH}개 입력해 주세요.`)
    return []
  }

  return value.flatMap((item: unknown, index): RecipeStep[] => {
    const description = isObject(item) ? readString(item.description) : undefined
    const image = isObject(item) ? readString(item.image) : undefined

    if (!isObject(item) || !description || description.length > MAX_TEXT_LENGTH) {
      errors.push(`${index + 1}번째 조리 과정 설명을 입력해 주세요.`)
      return []
    }

    // 순서는 보낸 배열 순서를 기준으로 1부터 다시 매긴다
    return [{ id: readString(item.id) || randomUUID(), order: index + 1, description, ...(image ? { image } : {}) }]
  })
}
