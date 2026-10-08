/** 관리자 로그인 상태 (서버 렌더링 때 받은 값을 화면 전체에서 함께 쓴다) */
export const useAdmin = () => {
  const status = useState<AdminStatus | null>('admin-status', () => null)
  const requestFetch = useRequestFetch()

  const isAdmin = computed<boolean>(() => status.value?.admin === true)

  // 상태를 확인하지 못해도 화면은 열리도록 로그인하지 않은 상태로 본다
  const refreshStatus = async (): Promise<AdminStatus> => {
    try {
      status.value = await requestFetch<AdminStatus>('/api/auth/me')
    }
    catch {
      status.value = { admin: false, enabled: false }
    }
    return status.value
  }

  const ensureStatus = async (): Promise<AdminStatus> => {
    return status.value ?? refreshStatus()
  }

  const login = async (input: AdminLoginInput): Promise<void> => {
    status.value = await $fetch<AdminStatus>('/api/auth/login', { method: 'POST', body: input })
  }

  const logout = async (): Promise<void> => {
    status.value = await $fetch<AdminStatus>('/api/auth/logout', { method: 'POST' })
  }

  return { status, isAdmin, ensureStatus, refreshStatus, login, logout }
}
