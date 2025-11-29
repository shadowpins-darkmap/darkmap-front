<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';

const logToOpener = (step, payload = {}) => {
  if (!window.opener) {
    console.warn('[SocialRedirect] opener 없음, step:', step);
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
    console.error('[SocialRedirect] postMessage 실패:', e);
  }
};

const notifyResult = (success) => {
  if (!window.opener) return;
  window.opener.postMessage(
    {
      type: 'SOCIAL_LOGIN_RESULT',
      success,
    },
    '*',
  );
};

const closePopup = () => {
  // setTimeout(() => {
  //   window.close();
  // }, 300);
};

onMounted(() => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const success = params.get('success') === 'true';

  logToOpener('SocialRedirect.mounted', {
    href: window.location.href,
    search,
    successParam: params.get('success'),
    hasOpener: !!window.opener,
  });

  if (!success) {
    logToOpener('SocialRedirect.result-fail');
    notifyResult(false);
    closePopup();
    return;
  }

  logToOpener('SocialRedirect.result-success');
  notifyResult(true);
  closePopup();
});
</script>

<style scoped>
.redirect {
  padding: 40px;
  text-align: center;
}
</style>
