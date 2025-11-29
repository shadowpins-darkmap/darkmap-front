<template>
  <div class="redirect">
    <p>소셜 로그인 준비 중...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { getOAuthLoginUrl } from '@/utils/oauth';

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const provider = params.get('provider'); // kakao or google

  if (!provider) {
    console.error('[SocialLoginStart] provider 없음');
    return;
  }

  const loginUrl = getOAuthLoginUrl(provider);
  if (!loginUrl) {
    console.error('[SocialLoginStart] loginUrl 없음');
    return;
  }

  // 💥 팝업 시작 이후 여기서 백엔드로 redirect
  window.location.href = loginUrl;
});
</script>

<style scoped>
.redirect {
  padding: 40px;
  text-align: center;
}
</style>
