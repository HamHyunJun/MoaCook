<template>
  <section class="recipe-youtube" aria-labelledby="youtube-title">
    <div class="header">
      <h2 id="youtube-title" class="section-title">참고 영상</h2>
      <a :href="searchUrl" target="_blank" rel="noopener noreferrer" class="search-link">
        유튜브에서 "{{ query }}" 검색 ↗
      </a>
    </div>

    <p v-if="pending" class="message">참고 영상을 불러오는 중입니다…</p>
    <ul v-else-if="videos.length" class="video-grid">
      <li v-for="video in videos" :key="video.id">
        <a :href="video.url" target="_blank" rel="noopener noreferrer" class="video-card">
          <div class="thumbnail-wrap">
            <img :src="video.thumbnail" alt="" class="thumbnail" loading="lazy">
          </div>
          <p class="title">{{ video.title }}</p>
          <p class="meta">
            {{ video.channelTitle }}<template v-if="video.viewCount !== undefined"> · 조회수 {{ formatViewCount(video.viewCount) }}</template>
          </p>
        </a>
      </li>
    </ul>
    <p v-else class="message">유튜브에서 "{{ query }}" 영상을 바로 찾아볼 수 있어요.</p>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 검색어 (레시피의 유튜브 검색 키워드, 없으면 요리 이름) */
  query: string
}>()

const q = computed<string>(() => props.query)

// 영상 목록은 상세 내용을 먼저 보여 준 뒤 브라우저에서 불러온다
const { data, pending } = useFetch<YoutubeSearchResult>('/api/youtube/search', {
  query: { q },
  server: false,
  lazy: true,
})

const videos = computed<YoutubeVideo[]>(() => data.value?.videos ?? [])
const searchUrl = computed<string>(() =>
  data.value?.searchUrl ?? `https://www.youtube.com/results?search_query=${encodeURIComponent(props.query)}`,
)

const viewCountFormatter = new Intl.NumberFormat('ko-KR', { notation: 'compact', maximumFractionDigits: 1 })

function formatViewCount(count: number): string {
  return `${viewCountFormatter.format(count)}회`
}
</script>

<style lang="scss" scoped>
$point-color: #FFBD59;
$sub-text-color: #7F879E;

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 16px;
  margin-bottom: 14px;
}

.section-title {
  margin: 0;
  padding-left: 10px;
  border-left: 4px solid $point-color;
  font-size: 1.35rem;
}

.search-link {
  color: #c4302b;
  font-size: 0.9rem;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.message {
  margin: 0;
  padding: 20px;
  border-radius: 12px;
  background-color: #f8f8f8;
  color: $sub-text-color;
  text-align: center;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.video-card {
  display: block;
  color: #2c3e50;
  text-decoration: none;

  &:hover .title {
    color: $point-color;
  }
}

.thumbnail-wrap {
  overflow: hidden;
  border-radius: 10px;
  background-color: #f0f0f0;
  aspect-ratio: 16 / 9;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  display: -webkit-box;
  overflow: hidden;
  margin: 8px 0 4px;
  font-size: 0.95rem;
  font-weight: bold;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.meta {
  margin: 0;
  color: $sub-text-color;
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .video-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}
</style>
