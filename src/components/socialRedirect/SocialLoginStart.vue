<template>
  <div class="redirect">
    <p>소셜 로그인 준비 중...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { getOAuthLoginUrl } from '@/utils/oauth';

const logToOpener = (step, payload = {}) => {
  if (!window.opener) {
    // 이게 null이면 지금도 opener가 끊겨 있는 상태
    console.warn('[SocialLoginStart] opener 없음, step:', step);
    return;
  }
  try {
    window.opener.postMessage(
      {
        type: 'SOCIAL_DEBUG',
        step,
        payload,
      },
      '*',
    );
  } catch (e) {
    console.error('[SocialLoginStart] postMessage 실패:', e);
  }
};

onMounted(() => {
  const href = window.location.href;
  const params = new URLSearchParams(window.location.search);
  const provider = params.get('provider');

  logToOpener('SocialLoginStart.mounted', {
    href,
    provider,
    hasOpener: !!window.opener,
  });

  if (!provider) {
    logToOpener('SocialLoginStart.no-provider');
    return;
  }

  const loginUrl = getOAuthLoginUrl(provider);
  if (!loginUrl) {
    logToOpener('SocialLoginStart.no-loginUrl', { provider });
    return;
  }

  logToOpener('SocialLoginStart.redirect-to-backend', { loginUrl });

  // 메시지가 부모에 도착할 시간 조금 주고 redirect
  setTimeout(() => {
    window.location.href = loginUrl;
  }, 200);
});
</script>

<style scoped>
.redirect {
  padding: 40px;
  text-align: center;
}
</style>
