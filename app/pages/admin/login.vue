<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="onSubmit">
      <h1 class="title">관리자 로그인</h1>
      <p class="description">레시피를 등록, 수정, 삭제하려면 관리자 비밀번호를 입력해 주세요.</p>

      <p v-if="status && !status.enabled" class="notice" role="alert">
        서버에 관리자 비밀번호(NUXT_ADMIN_PASSWORD)와 세션 키(NUXT_SESSION_SECRET)가 설정되지 않아 로그인할 수 없습니다.
      </p>

      <label class="field">
        <span class="label">비밀번호</span>
        <input
          v-model="password"
          type="password"
          class="input"
          autocomplete="current-password"
          required
          :disabled="submitting"
        >
      </label>

      <p v-if="errorMessage" class="error" role="alert">{{ errorMessage }}</p>

      <button type="submit" class="submit" :disabled="submitting || !password">
        {{ submitting ? '확인 중…' : '로그인' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { status, ensureStatus, login } = useAdmin()

const password = ref<string>('')
const submitting = ref<boolean>(false)
const errorMessage = ref<string>('')

// 다른 사이트로 보내지 않도록 내부 경로만 허용한다
const redirectPath = computed<string>(() => {
  const redirect = route.query.redirect
  return typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
    ? redirect
    : '/admin/recipes'
})

const current = await ensureStatus()
if (current.admin) {
  await navigateTo(redirectPath.value, { replace: true })
}

const onSubmit = async (): Promise<void> => {
  submitting.value = true
  errorMessage.value = ''
  try {
    await login({ password: password.value })
    await navigateTo(redirectPath.value, { replace: true })
  }
  catch (error: unknown) {
    errorMessage.value = getErrorMessage(error, '로그인하지 못했습니다.')
  }
  finally {
    submitting.value = false
  }
}

useHead({ title: '관리자 로그인 | MoaCook' })
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.login-page {
  display: flex;
  justify-content: center;
  padding: 72px 20px;
}

.login-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 420px;
  padding: 36px 32px;
  border: $border-width solid $line-color;
  border-radius: $radius-lg;
  background-color: $surface-color;
  text-align: left;
}

.title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: $tracking-tight;
}

.description {
  margin: 0;
  color: $sub-text-color;
  font-size: $font-size-small;
}

.notice {
  margin: 0;
  padding: 12px 14px;
  border-radius: $radius-md;
  background-color: $point-soft-color;
  color: $point-strong-color;
  font-size: $font-size-small;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: $font-size-small;
  font-weight: 700;
}

.input {
  height: 46px;
  padding: 0 14px;
  border: $border-width solid $line-color;
  border-radius: $radius-md;
  outline: none;
  font-size: $font-size-body;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: $text-color;
  }
}

.error {
  margin: 0;
  color: $error-color;
  font-size: $font-size-small;
}

.submit {
  height: 48px;
  border: none;
  border-radius: $radius-md;
  background-color: $point-color;
  color: #fff;
  font-size: $font-size-body;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: $point-strong-color;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}
</style>
