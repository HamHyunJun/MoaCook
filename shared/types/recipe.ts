/** 레시피 카테고리 (헤더 네비게이션의 조리법 분류와 동일) */
export const RECIPE_CATEGORIES = ['한식', '중식', '일식', '양식', '비건'] as const

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[number]

/** 난이도: 1(쉬움) ~ 3(어려움), 화면에서는 쉬움·보통·어려움으로 표시 */
export type RecipeDifficulty = 1 | 2 | 3

export interface RecipeIngredient {
  id: string
  name: string
  /** 분량 (예: "300g", "1큰술", "1/2모") */
  amount: string
}

export interface RecipeStep {
  id: string
  /** 1부터 시작하는 조리 순서 */
  order: number
  description: string
  image?: string
}

export interface Recipe {
  id: string
  name: string
  /** 대표 이미지 URL */
  image: string
  description: string
  category: RecipeCategory
  difficulty: RecipeDifficulty
  /** 조리 시간 (분) */
  cookingTime: number
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  /** 참고 영상 검색 키워드 (없으면 요리 이름으로 검색) */
  youtubeQuery?: string
  /** ISO 8601 문자열 */
  createdAt: string
  updatedAt: string
}

/** 목록 화면에서 사용하는 요약 정보 */
export type RecipeSummary = Pick<
  Recipe,
  'id' | 'name' | 'image' | 'description' | 'category' | 'difficulty' | 'cookingTime'
>

/** 서버에서 검증을 마친 레시피 내용 (id, 생성/수정 시각 제외) */
export type RecipeContent = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>

/** 등록/수정 요청의 재료 (새 재료는 id 없이 보내면 서버에서 생성) */
export type RecipeIngredientInput = Omit<RecipeIngredient, 'id'> & { id?: string }

/** 등록/수정 요청의 조리 과정 (순서는 배열 순서로 서버에서 매김) */
export type RecipeStepInput = Omit<RecipeStep, 'id' | 'order'> & { id?: string }

/** 레시피 등록/수정 요청 본문 */
export interface RecipeInput extends Omit<RecipeContent, 'ingredients' | 'steps'> {
  ingredients: RecipeIngredientInput[]
  steps: RecipeStepInput[]
}

/** 목록 검색/필터 조건 (모두 선택값) */
export interface RecipeSearchQuery {
  q?: string
  category?: RecipeCategory
  difficulty?: RecipeDifficulty
  /** 최대 조리 시간 (분) */
  maxTime?: number
}
