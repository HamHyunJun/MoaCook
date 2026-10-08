<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="brand">
        <AppLogo class="logo" />
        <p class="copyright">© {{ year }} MoaCook. 집에서 만드는 오늘의 한 끼.</p>
      </div>
      <nav class="admin-links" aria-label="관리">
        <template v-if="isAdmin">
          <NuxtLink to="/admin/recipes" class="link">레시피 관리</NuxtLink>
          <button type="button" class="link" @click="onLogout">로그아웃</button>
        </template>
        <NuxtLink v-else to="/admin/login" class="link">관리자</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { isAdmin, logout } = useAdmin()
const year = new Date().getFullYear()

async function onLogout(): Promise<void> {
  await logout()
  await navigateTo('/')
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.footer {
  margin-top: 40px;
  border-top: 1px solid $line-color;
  background-color: #FAFAFB;
  padding-bottom: var(--safe-bottom);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 32px 24px;
  color: $sub-text-color;
  font-size: $font-size-caption;
  text-align: left;
}

.logo {
  font-size: 1rem;
}

.copyright {
  margin: 12px 0 0;
}

.admin-links {
  display: flex;
  gap: 20px;
}

.link {
  padding: 0;
  border: none;
  background: none;
  color: $sub-text-color;
  font-size: inherit;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: $text-color;
  }
}

@media (max-width: $mobile-max-width) {
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 28px 16px;
  }
}
</style>
