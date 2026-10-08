// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      // 앱(웹뷰)에서 노치/상태 표시줄 영역까지 화면을 채우고 safe-area 여백으로 피한다
      viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
      title: 'MoaCook',
      meta: [
        { name: 'theme-color', content: '#ffffff' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-title', content: 'MoaCook' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      ],
      link: [
        // 예전 기본 아이콘이 브라우저에 남아 있지 않도록 주소에 버전을 붙인다
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2' },
        { rel: 'icon', type: 'image/x-icon', sizes: '48x48', href: '/favicon.ico?v=2' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=2' },
        // 휴대폰에서 '홈 화면에 추가'하면 앱처럼 열리도록 하는 설정
        { rel: 'manifest', href: '/manifest.webmanifest' },
        // 본문 글꼴 Pretendard (public/fonts, 화면에 쓰인 글자 묶음만 내려받는 방식)
        { rel: 'stylesheet', href: '/fonts/pretendard/pretendardvariable-dynamic-subset.css' },
      ],
    },
  },
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  // 서버 전용 설정 (클라이언트에 노출되지 않음), 같은 이름의 NUXT_ 환경변수로 설정 (.env.example 참고)
  runtimeConfig: {
    youtubeApiKey: '', // NUXT_YOUTUBE_API_KEY
    adminPassword: '', // NUXT_ADMIN_PASSWORD
    sessionSecret: '', // NUXT_SESSION_SECRET
    supabaseUrl: '', // NUXT_SUPABASE_URL
    supabaseServiceRoleKey: '', // NUXT_SUPABASE_SERVICE_ROLE_KEY
    supabaseBucket: 'recipe-images', // NUXT_SUPABASE_BUCKET
  },
  nitro: {
    // 레시피 데이터와 업로드 이미지는 .data 폴더에 파일로 저장 (git 제외)
    storage: {
      recipes: { driver: 'fs', base: './.data/recipes' },
      uploads: { driver: 'fs', base: './.data/uploads' },
    },
    // Vercel 서버를 서울(icn1)에 두어 Supabase(서울)와 사용자 모두에게 가깝게 한다
    vercel: {
      functions: { regions: ['icn1'] },
    },
  },
  routeRules: {
    // 기존 한식 페이지 주소는 홈 레시피 목록(한식)으로 이동
    '/menu/koreafood': { redirect: '/?category=' + encodeURIComponent('한식') },
  },
})
