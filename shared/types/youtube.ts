export interface YoutubeVideo {
  id: string
  title: string
  channelTitle: string
  thumbnail: string
  publishedAt: string
  /** 조회수 (제공되지 않으면 undefined) */
  viewCount?: number
  url: string
}

export interface YoutubeSearchResult {
  query: string
  /** 유튜브 검색 결과 페이지 주소 (영상 목록을 가져오지 못해도 항상 제공) */
  searchUrl: string
  videos: YoutubeVideo[]
}
