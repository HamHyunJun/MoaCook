interface ApiErrorBody {
  message?: unknown
  data?: { errors?: unknown }
}

function readErrorBody(error: unknown): ApiErrorBody | undefined {
  if (typeof error !== 'object' || error === null || !('data' in error)) return undefined
  const body = (error as { data: unknown }).data
  return typeof body === 'object' && body !== null ? (body as ApiErrorBody) : undefined
}

/** API 오류 응답에서 사용자에게 보여 줄 메시지 목록을 꺼낸다 */
export function getErrorMessages(error: unknown, fallback: string): string[] {
  const body = readErrorBody(error)
  const errors = body?.data?.errors

  if (Array.isArray(errors) && errors.length > 0 && errors.every(item => typeof item === 'string')) {
    return errors
  }
  return [typeof body?.message === 'string' && body.message ? body.message : fallback]
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return getErrorMessages(error, fallback)[0] ?? fallback
}
