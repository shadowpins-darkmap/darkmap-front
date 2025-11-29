<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { BASE_URL } from '@/constant/url';

const notifyOpener = (payload) => {
  if (!window.opener) {
    console.warn('[SocialRedirect] window.opener 가 없음, fallback으로 self redirect');
    window.location.replace(BASE_URL || '/');
    return;
  }

  try {
    window.opener.postMessage(payload, '*');
  } catch (error) {
    console.error('[SocialRedirect] postMessage 실패:', error);
  }
};

const closePopup = () => {
  setTimeout(() => {
    window.close();
  }, 300);
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success') === 'true';

  console.log('[SocialRedirect] loaded', {
    search: window.location.search,
    success,
    hasOpener: !!window.opener,
  });

  if (!success) {
    notifyOpener({
      type: 'SOCIAL_LOGIN_RESULT',
      success: false,
    });
    closePopup();
    return;
  }
  notifyOpener({
    type: 'SOCIAL_LOGIN_RESULT',
    success: true,
  });

  closePopup();
});
</script>
