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

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export const UPLOAD_FILE_NAME_PATTERN = /^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/

export function uploadStorage() {
  return useStorage('uploads')
}
