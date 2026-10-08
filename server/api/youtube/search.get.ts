const MAX_QUERY_LENGTH = 100

/** 유튜브 참고 영상 검색 (API 키는 서버에서만 사용) */
export default defineEventHandler(async (event): Promise<YoutubeSearchResult> => {
  const { q } = getQuery(event)
  const query = typeof q === 'string' ? q.trim() : ''

  if (!query || query.length > MAX_QUERY_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: `검색어를 1~${MAX_QUERY_LENGTH}자로 입력해 주세요.` })
  }

  const result: YoutubeSearchResult = { query, searchUrl: youtubeSearchUrl(query), videos: [] }
  const { youtubeApiKey } = useRuntimeConfig(event)

  // 키가 없거나 API 호출에 실패해도 검색 링크는 보여 줄 수 있도록 빈 목록으로 응답
  if (!youtubeApiKey) return result

  try {
    result.videos = await searchYoutubeVideos(query, youtubeApiKey)
  }
  catch (error: unknown) {
    const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error ? error.statusCode : undefined
    console.warn('[youtube] 영상 검색 실패, 상태 코드:', statusCode ?? '알 수 없음')
  }

  return result
})
