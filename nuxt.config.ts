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
  routeRules: {
    // 기존 한식 페이지 주소는 레시피 목록(한식)으로 이동
    '/menu/koreafood': { redirect: '/recipes?category=' + encodeURIComponent('한식') },
  },
})
