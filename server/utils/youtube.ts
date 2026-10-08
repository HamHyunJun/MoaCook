const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'
/** 관련도 순으로 가져온 뒤 조회수 순으로 다시 정렬할 후보 수 */
const CANDIDATE_COUNT = 10
const RESULT_COUNT = 6
const CACHE_SECONDS = 60 * 60 * 6

interface YoutubeSearchResponse {
  items?: {
    id?: { videoId?: string }
    snippet?: {
      title?: string
      channelTitle?: string
      publishedAt?: string
      thumbnails?: Record<string, { url?: string } | undefined>
    }
  }[]
}

interface YoutubeVideosResponse {
  items?: {
    id?: string
    statistics?: { viewCount?: string }
  }[]
}

const HTML_ENTITIES: Readonly<Record<string, string>> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': '\'',
}

/** 검색 API 제목에 들어 있는 HTML 엔티티를 문자로 되돌린다 */
function decodeHtmlEntities(text: string): string {
  return text.replace(/&(amp|lt|gt|quot|#39);/g, entity => HTML_ENTITIES[entity] ?? entity)
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

async function fetchYoutubeVideos(query: string, apiKey: string): Promise<YoutubeVideo[]> {
  // 1) 관련도 순 검색 (100 유닛)
  // 키는 URL(로그에 남을 수 있음) 대신 헤더로 전달
  const headers = { 'X-Goog-Api-Key': apiKey }
  const search = await $fetch<YoutubeSearchResponse>(`${YOUTUBE_API_BASE}/search`, {
    headers,
    query: {
      part: 'snippet',
      q: query,
      type: 'video',
      maxResults: CANDIDATE_COUNT,
      order: 'relevance',
      regionCode: 'KR',
      relevanceLanguage: 'ko',
      safeSearch: 'moderate',
    },
  })

  const videos: YoutubeVideo[] = (search.items ?? []).flatMap((item): YoutubeVideo[] => {
    const id = item.id?.videoId
    const snippet = item.snippet
    if (!id || !snippet?.title) return []

    const thumbnails = snippet.thumbnails ?? {}
    return [{
      id,
      title: decodeHtmlEntities(snippet.title),
      channelTitle: decodeHtmlEntities(snippet.channelTitle ?? ''),
      thumbnail: thumbnails.medium?.url ?? thumbnails.high?.url ?? thumbnails.default?.url ?? `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      publishedAt: snippet.publishedAt ?? '',
      url: `https://www.youtube.com/watch?v=${id}`,
    }]
  })

  if (videos.length === 0) return []

  // 2) 조회수 조회 (1 유닛) 후 관련도 높은 후보 중 조회수 순으로 정렬
  const stats = await $fetch<YoutubeVideosResponse>(`${YOUTUBE_API_BASE}/videos`, {
    headers,
    query: { part: 'statistics', id: videos.map(video => video.id).join(',') },
  })
  const viewCounts = new Map((stats.items ?? []).map(item => [item.id, Number(item.statistics?.viewCount)]))

  return videos
    .map(video => ({ ...video, viewCount: Number.isFinite(viewCounts.get(video.id)) ? viewCounts.get(video.id) : undefined }))
    .sort((a, b) => (b.viewCount ?? -1) - (a.viewCount ?? -1))
    .slice(0, RESULT_COUNT)
}

/** 같은 검색어는 일정 시간 캐시해 API 할당량(검색 1회 101 유닛)을 아낀다. 실패한 요청은 캐시하지 않는다 */
export const searchYoutubeVideos = defineCachedFunction(fetchYoutubeVideos, {
  name: 'youtube-search',
  maxAge: CACHE_SECONDS,
  getKey: (query: string) => query,
})
