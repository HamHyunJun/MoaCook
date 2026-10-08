import { randomUUID } from 'node:crypto'

/** 이미지 업로드 (multipart/form-data, 필드 이름: image) */
export default defineEventHandler(async (event): Promise<ImageUploadResult> => {
  await requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find(part => part.name === 'image' && part.filename)

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: '업로드할 이미지를 선택해 주세요.' })
  }

  const extension = file.type ? IMAGE_EXTENSIONS[file.type] : undefined
  if (!extension) {
    throw createError({ statusCode: 400, statusMessage: 'Bad Request', message: 'JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.' })
  }

  if (file.data.length > MAX_IMAGE_SIZE) {
    throw createError({ statusCode: 413, statusMessage: 'Payload Too Large', message: '이미지는 4MB 이하만 업로드할 수 있습니다.' })
  }

  const url = await saveUploadedImage(`${randomUUID()}.${extension}`, file.data, file.type ?? 'application/octet-stream')

  setResponseStatus(event, 201)
  return { url }
})
