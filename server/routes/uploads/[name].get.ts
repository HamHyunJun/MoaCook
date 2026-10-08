/** 업로드한 이미지 제공 */
export default defineEventHandler(async (event): Promise<Buffer> => {
  const name = getRouterParam(event, 'name') ?? ''
  const data = UPLOAD_FILE_NAME_PATTERN.test(name)
    ? await uploadStorage().getItemRaw<Buffer>(name)
    : null

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found', message: '이미지를 찾을 수 없습니다.' })
  }

  const extension = name.split('.').pop() ?? ''
  setResponseHeaders(event, {
    'content-type': IMAGE_CONTENT_TYPES[extension] ?? 'application/octet-stream',
    // 파일 이름이 매번 새로 만들어지므로 오래 캐시해도 된다
    'cache-control': 'public, max-age=31536000, immutable',
    'x-content-type-options': 'nosniff',
  })

  return data
})
