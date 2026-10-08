/** 업로드 가능한 이미지 형식과 저장 확장자 */
export const IMAGE_EXTENSIONS: Readonly<Record<string, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export const IMAGE_CONTENT_TYPES: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(IMAGE_EXTENSIONS).map(([type, extension]) => [extension, type]),
)

// Vercel 서버 함수의 요청 크기 제한(4.5MB)보다 작게 둔다
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024

export const UPLOAD_FILE_NAME_PATTERN = /^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/

export const uploadStorage = () => {
  return useStorage('uploads')
}

/**
 * 업로드한 이미지를 저장하고 화면에서 쓸 주소를 돌려준다.
 * Supabase 설정이 있으면 Storage 버킷(공개)에, 없으면 서버의 .data/uploads 폴더에 저장한다.
 */
export const saveUploadedImage = async (fileName: string, data: Buffer, contentType: string): Promise<string> => {
  const config = getSupabaseConfig()

  if (!config) {
    await uploadStorage().setItemRaw(fileName, data)
    return `/uploads/${fileName}`
  }

  const objectPath = `${config.bucket}/${fileName}`
  try {
    await $fetch(`${config.url}/storage/v1/object/${objectPath}`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders(config),
        'Content-Type': contentType,
        'Cache-Control': 'max-age=31536000',
        'x-upsert': 'false',
      },
      body: data,
    })
  }
  catch (error: unknown) {
    toSupabaseError(error, '이미지 업로드')
  }

  return `${config.url}/storage/v1/object/public/${objectPath}`
}
