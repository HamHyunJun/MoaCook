// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
      title: 'MoaCook',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  components: [
    { path: '~/components', pathPrefix: false },
  ],
  nitro: {
    // 레시피 데이터와 업로드 이미지는 .data 폴더에 파일로 저장 (git 제외)
    storage: {
      recipes: { driver: 'fs', base: './.data/recipes' },
      uploads: { driver: 'fs', base: './.data/uploads' },
    },
  },
  routeRules: {
    // 기존 한식 페이지 주소는 레시피 목록(한식)으로 이동
    '/menu/koreafood': { redirect: '/recipes?category=' + encodeURIComponent('한식') },
  },
})
