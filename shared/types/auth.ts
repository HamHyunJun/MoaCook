export interface AdminStatus {
  /** 관리자 로그인 여부 */
  admin: boolean
  /** 서버에 관리자 비밀번호가 설정되어 있는지 (없으면 로그인할 수 없음) */
  enabled: boolean
}

export interface AdminLoginInput {
  password: string
}
