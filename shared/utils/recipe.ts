import { RECIPE_CATEGORIES } from '../types/recipe'
import type { RecipeCategory, RecipeDifficulty, RecipeSearchQuery } from '../types/recipe'

export function isRecipeCategory(value: unknown): value is RecipeCategory {
  return typeof value === 'string' && (RECIPE_CATEGORIES as readonly string[]).includes(value)
}

export function isRecipeDifficulty(value: unknown): value is RecipeDifficulty {
  return value === 1 || value === 2 || value === 3
}

const MAX_SEARCH_LENGTH = 100

const DIFFICULTY_LABELS: Record<RecipeDifficulty, string> = {
  1: '쉬움',
  2: '보통',
  3: '어려움',
}

/** 난이도를 한눈에 읽히는 말로 변환 (예: 2 → "보통") */
export function formatDifficulty(difficulty: RecipeDifficulty): string {
  return DIFFICULTY_LABELS[difficulty]
}

function firstValue(value: unknown): unknown {
  return Array.isArray(value) ? value[0] : value
}

/**
 * URL 쿼리(라우트 쿼리, 서버 getQuery 결과)를 검색 조건으로 변환한다.
 * 형식이 맞지 않는 값은 조건에서 제외한다.
 */
export function parseRecipeSearchQuery(query: Record<string, unknown>): RecipeSearchQuery {
  const result: RecipeSearchQuery = {}

  const q = firstValue(query.q)
  if (typeof q === 'string' && q.trim()) {
    result.q = q.trim().slice(0, MAX_SEARCH_LENGTH)
  }

  const category = firstValue(query.category)
  if (isRecipeCategory(category)) {
    result.category = category
  }

  const difficulty = Number(firstValue(query.difficulty))
  if (isRecipeDifficulty(difficulty)) {
    result.difficulty = difficulty
  }

  const maxTime = Number(firstValue(query.maxTime))
  if (Number.isInteger(maxTime) && maxTime > 0) {
    result.maxTime = maxTime
  }

  return result
}
