<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';

const notifyOpener = (payload) => {
  if (!window.opener) {
    console.warn('[SocialRedirect] window.opener 없음!');
    return;
  }
  try {
    window.opener.postMessage(payload, '*');
  } catch (e) {
    console.error('[SocialRedirect] postMessage 실패', e);
  }
};

const closePopup = () => {
  setTimeout(() => {
    window.close();
  }, 200);
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success') === 'true';

  if (!success) {
    notifyOpener({ type: 'SOCIAL_LOGIN_RESULT', success: false });
    closePopup();
    return;
  }

  notifyOpener({ type: 'SOCIAL_LOGIN_RESULT', success: true });
  closePopup();
});
</script>
