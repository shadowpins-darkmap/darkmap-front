<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';

const notifyOpener = (payload) => {
  if (!window.opener) return;

  try {
    window.opener.postMessage(payload, '*'); // 부모에서 origin 필터링
  } catch (e) {
    console.error('[SocialRedirect] postMessage error', e);
  }
};

const logToOpener = (message, extra = {}) => {
  if (!window.opener) return;
  try {
    window.opener.postMessage(
      {
        type: 'SOCIAL_LOGIN_DEBUG',
        message,
        extra,
      },
      '*',
    );
  } catch (e) {
    console.error('[SocialRedirect] postMessage error', e);
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

  logToOpener('SocialRedirect mounted', {
    search: window.location.search,
    successParam: params.get('success'),
    hasOpener: !!window.opener,
  });

  if (!success) {
    logToOpener('success=false, send fail result');
    notifyOpener({ type: 'SOCIAL_LOGIN_RESULT', success: false });
    closePopup();
    return;
  }

  logToOpener('success=true, send success result');

  notifyOpener({
    type: 'SOCIAL_LOGIN_RESULT',
    success: true,
  });

  closePopup();
});
</script>
