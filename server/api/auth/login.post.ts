export default defineEventHandler(async (event): Promise<AdminStatus> => {
  if (!isAdminEnabled()) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: '서버에 관리자 비밀번호(NUXT_ADMIN_PASSWORD)와 세션 키(NUXT_SESSION_SECRET, 32자 이상)를 설정해 주세요.',
    })
  }

  const body = await readBody<Partial<AdminLoginInput> | null>(event)
  const password = typeof body?.password === 'string' ? body.password : ''

  if (!isAdminPassword(password)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: '비밀번호가 올바르지 않습니다.' })
  }

  const session = await useAdminSession(event)
  await session.update({ admin: true })
  return { admin: true, enabled: true }
})
