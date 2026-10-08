/**
 * 목록 화면 상태: 상세 화면에 다녀와도 보던 목록과 필터를 그대로 보여 주기 위해 앱 전체에서 기억한다.
 * - cache: 검색 조건별로 받아 둔 목록 (돌아왔을 때 바로 보여 주고 뒤에서 새로 받는다)
 * - lastListPath: 마지막으로 본 목록 주소 (필터가 담긴 쿼리 포함)
 */
export const useRecipeList = () => {
  const cache = useState<Record<string, RecipeSummary[]>>('recipe-list-cache', () => ({}))
  const lastListPath = useState<string>('recipe-list-last-path', () => '/')

  /** 받아 둔 목록에서 레시피 요약 정보를 찾는다 (상세 화면을 바로 그리는 데 사용) */
  const findSummary = (id: string): RecipeSummary | undefined => {
    for (const list of Object.values(cache.value)) {
      const found = list.find(recipe => recipe.id === id)
      if (found) return found
    }
    return undefined
  }

  return { cache, lastListPath, findSummary }
}
