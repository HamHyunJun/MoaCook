export default defineEventHandler(async (event): Promise<AdminStatus> => {
  if (isAdminEnabled()) {
    const session = await useAdminSession(event)
    await session.clear()
  }
  return { admin: false, enabled: isAdminEnabled() }
})
