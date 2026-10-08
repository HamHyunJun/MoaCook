// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: 'MoaCook',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // 본문 글꼴 (Pretendard, 사용하는 글자만 나눠 받는 웹폰트)
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
        },
      ],
    },
  },
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  runtimeConfig: {
    // 서버 전용 (클라이언트에 노출되지 않음), 환경변수 NUXT_YOUTUBE_API_KEY로 설정
    youtubeApiKey: '',
  },
  nitro: {
    // 레시피 데이터와 업로드 이미지는 .data 폴더에 파일로 저장 (git 제외)
    storage: {
      recipes: { driver: 'fs', base: './.data/recipes' },
      uploads: { driver: 'fs', base: './.data/uploads' },
    },
  },
  routeRules: {
    // 기존 한식 페이지 주소는 홈 레시피 목록(한식)으로 이동
    '/menu/koreafood': { redirect: '/?category=' + encodeURIComponent('한식') },
  },
})
