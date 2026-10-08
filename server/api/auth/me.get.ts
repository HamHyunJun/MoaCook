export default defineEventHandler(async (event): Promise<AdminStatus> => {
  return { admin: await isAdmin(event), enabled: isAdminEnabled() }
})
