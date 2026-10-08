/** 관리 화면은 관리자만 들어갈 수 있다. 로그인하지 않았으면 로그인 화면으로 보낸다 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { ensureStatus } = useAdmin()
  const status = await ensureStatus()

  if (!status.admin) {
    return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } })
  }
})
