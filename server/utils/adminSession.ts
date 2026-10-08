import { createHash, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

interface AdminSessionData {
  admin?: boolean
}

const SESSION_NAME = 'moacook-admin'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7일
const MIN_SECRET_LENGTH = 32

function sessionSecret(): string {
  const { sessionSecret } = useRuntimeConfig()
  if (sessionSecret.length < MIN_SECRET_LENGTH) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server Misconfigured',
      message: `NUXT_SESSION_SECRET을 ${MIN_SECRET_LENGTH}자 이상으로 설정해 주세요.`,
    })
  }
  return sessionSecret
}

/** 암호화된 쿠키에 관리자 로그인 상태를 저장한다 */
export function useAdminSession(event: H3Event) {
  return useSession<AdminSessionData>(event, {
    name: SESSION_NAME,
    password: sessionSecret(),
    maxAge: SESSION_MAX_AGE,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: !import.meta.dev,
    },
  })
}

/** 관리자 비밀번호와 세션 암호화 키가 모두 설정되어 있어야 로그인할 수 있다 */
export function isAdminEnabled(): boolean {
  const { adminPassword, sessionSecret } = useRuntimeConfig()
  return adminPassword.length > 0 && sessionSecret.length >= MIN_SECRET_LENGTH
}

/** 길이와 관계없이 일정한 시간으로 비교하기 위해 해시끼리 비교한다 */
export function isAdminPassword(input: string): boolean {
  const { adminPassword } = useRuntimeConfig()
  if (!adminPassword) return false

  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(input), digest(adminPassword))
}

export async function isAdmin(event: H3Event): Promise<boolean> {
  if (!isAdminEnabled()) return false
  const session = await useAdminSession(event)
  return session.data.admin === true
}

/** 관리자만 쓸 수 있는 API에서 호출한다 */
export async function requireAdmin(event: H3Event): Promise<void> {
  if (!(await isAdmin(event))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: '관리자 로그인이 필요합니다.' })
  }
}
