/**
 * Supabase REST API 호출 도우미
 * 별도 SDK 없이 PostgREST(/rest/v1)와 Storage(/storage/v1) HTTP API를 직접 호출한다.
 * service role 키는 서버에서만 쓰고 클라이언트로 보내지 않는다.
 */

export interface SupabaseConfig {
  url: string
  serviceRoleKey: string
  bucket: string
}

/** NUXT_SUPABASE_URL과 NUXT_SUPABASE_SERVICE_ROLE_KEY가 모두 있으면 Supabase를 쓴다 */
export function getSupabaseConfig(): SupabaseConfig | undefined {
  const { supabaseUrl, supabaseServiceRoleKey, supabaseBucket } = useRuntimeConfig()
  if (!supabaseUrl || !supabaseServiceRoleKey) return undefined

  return {
    url: supabaseUrl.replace(/\/+$/, ''),
    serviceRoleKey: supabaseServiceRoleKey,
    bucket: supabaseBucket || 'recipe-images',
  }
}

export function supabaseHeaders(config: SupabaseConfig): Record<string, string> {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`,
  }
}

/** 실패 원인은 서버 로그에만 남기고 사용자에게는 일반 메시지를 보여 준다 */
export function toSupabaseError(error: unknown, action: string): never {
  const status = (error as { statusCode?: number } | undefined)?.statusCode
  const detail = (error as { data?: unknown } | undefined)?.data
  console.error(`[supabase] ${action} 실패`, status ?? '', detail ?? '')
  throw createError({ statusCode: 502, statusMessage: 'Bad Gateway', message: '데이터 저장소에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.' })
}
