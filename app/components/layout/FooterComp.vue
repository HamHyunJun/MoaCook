<template>
  <footer class="footer">
    <div class="footer-inner">
      <span class="copyright">© MoaCook</span>
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

async function onLogout(): Promise<void> {
  await logout()
  await navigateTo('/')
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/variables' as *;

.footer {
  border-top: 1px solid $line-color;
  padding-bottom: env(safe-area-inset-bottom);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: $content-max-width;
  margin: 0 auto;
  padding: 24px 20px;
  color: $sub-text-color;
  font-size: $font-size-caption;
}

.admin-links {
  display: flex;
  gap: 16px;
}

.link {
  padding: 0;
  border: none;
  background: none;
  color: $sub-text-color;
  font-size: inherit;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: $text-color;
  }
}
</style>
