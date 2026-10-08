/**
 * 레시피 저장소
 * - Supabase 설정이 있으면 Supabase(Postgres)의 recipes 테이블을 쓴다. (배포 환경)
 * - 없으면 서버의 .data 폴더에 파일로 저장한다. (로컬 개발)
 */
export interface RecipeRepository {
  list(): Promise<Recipe[]>
  get(id: string): Promise<Recipe | undefined>
  /** 같은 id가 있으면 덮어쓰고, 없으면 추가한다 */
  save(recipe: Recipe): Promise<void>
  /** 삭제했으면 true */
  remove(id: string): Promise<boolean>
  /** 마지막으로 반영한 초기 데이터 버전 (반영한 적 없으면 0) */
  getSeedVersion(): Promise<number>
  setSeedVersion(version: number): Promise<void>
}

let repository: RecipeRepository | undefined

export const recipeRepository = (): RecipeRepository => {
  if (!repository) {
    const config = getSupabaseConfig()
    repository = config ? createSupabaseRepository(config) : createLocalRepository()
  }
  return repository
}

// ---------- 로컬 파일 저장소 ----------

const LOCAL_RECIPE_PREFIX = 'items'
/** 예전 버전은 true로 저장했으므로 1로 본다 */
const LOCAL_SEEDED_KEY = 'seeded'

const createLocalRepository = (): RecipeRepository => {
  const storage = () => useStorage('recipes')
  const key = (id: string) => `${LOCAL_RECIPE_PREFIX}:${id}`

  return {
    async list() {
      const keys = await storage().getKeys(LOCAL_RECIPE_PREFIX)
      const recipes = await Promise.all(keys.map(itemKey => storage().getItem<Recipe>(itemKey)))
      return recipes.filter((recipe): recipe is Recipe => recipe !== null)
    },
    async get(id) {
      return (await storage().getItem<Recipe>(key(id))) ?? undefined
    },
    async save(recipe) {
      await storage().setItem(key(recipe.id), recipe)
    },
    async remove(id) {
      if (!(await storage().hasItem(key(id)))) return false
      await storage().removeItem(key(id))
      return true
    },
    async getSeedVersion() {
      const value = await storage().getItem(LOCAL_SEEDED_KEY)
      if (typeof value === 'number') return value
      return value ? 1 : 0
    },
    async setSeedVersion(version) {
      await storage().setItem(LOCAL_SEEDED_KEY, version)
    },
  }
}

// ---------- Supabase 저장소 ----------

/** recipes 테이블의 한 행 (supabase/schema.sql 참고) */
interface RecipeRow {
  id: string
  name: string
  image: string
  description: string
  category: RecipeCategory
  difficulty: RecipeDifficulty
  cooking_time: number
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
  youtube_query: string | null
  created_at: string
  updated_at: string
}

const SEED_VERSION_KEY = 'seed_version'

const toRow = (recipe: Recipe): RecipeRow => {
  return {
    id: recipe.id,
    name: recipe.name,
    image: recipe.image,
    description: recipe.description,
    category: recipe.category,
    difficulty: recipe.difficulty,
    cooking_time: recipe.cookingTime,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    youtube_query: recipe.youtubeQuery ?? null,
    created_at: recipe.createdAt,
    updated_at: recipe.updatedAt,
  }
}

const fromRow = (row: RecipeRow): Recipe => {
  return {
    id: row.id,
    name: row.name,
    image: row.image,
    description: row.description,
    category: row.category,
    difficulty: row.difficulty,
    cookingTime: row.cooking_time,
    ingredients: row.ingredients,
    steps: row.steps,
    ...(row.youtube_query ? { youtubeQuery: row.youtube_query } : {}),
    // Postgres가 돌려주는 시간 형식을 앱에서 쓰는 ISO 형식으로 맞춘다
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  }
}

const createSupabaseRepository = (config: SupabaseConfig): RecipeRepository => {
  const rest = $fetch.create({
    baseURL: `${config.url}/rest/v1`,
    headers: supabaseHeaders(config),
  })

  const request = async <T>(action: string, run: () => Promise<T>): Promise<T> => {
    try {
      return await run()
    }
    catch (error: unknown) {
      return toSupabaseError(error, action)
    }
  }

  return {
    list: () => request('레시피 목록 조회', async () => {
      const rows = await rest<RecipeRow[]>('/recipes', { query: { select: '*', order: 'created_at.asc' } })
      return rows.map(fromRow)
    }),
    get: id => request('레시피 조회', async () => {
      const rows = await rest<RecipeRow[]>('/recipes', { query: { select: '*', id: `eq.${id}` } })
      return rows[0] ? fromRow(rows[0]) : undefined
    }),
    save: recipe => request('레시피 저장', async () => {
      await rest('/recipes', {
        method: 'POST',
        query: { on_conflict: 'id' },
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: toRow(recipe),
      })
    }),
    remove: id => request('레시피 삭제', async () => {
      const rows = await rest<Pick<RecipeRow, 'id'>[]>('/recipes', {
        method: 'DELETE',
        query: { id: `eq.${id}`, select: 'id' },
        headers: { Prefer: 'return=representation' },
      })
      return rows.length > 0
    }),
    getSeedVersion: () => request('초기 데이터 버전 조회', async () => {
      const rows = await rest<{ value: number }[]>('/app_settings', { query: { select: 'value', key: `eq.${SEED_VERSION_KEY}` } })
      return Number(rows[0]?.value ?? 0)
    }),
    setSeedVersion: version => request('초기 데이터 버전 저장', async () => {
      await rest('/app_settings', {
        method: 'POST',
        query: { on_conflict: 'key' },
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: { key: SEED_VERSION_KEY, value: version },
      })
    }),
  }
}
