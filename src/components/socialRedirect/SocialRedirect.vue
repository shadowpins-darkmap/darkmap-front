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
  if (!window.opener) {
    console.warn('[SocialRedirect] notifyResult 호출됐지만 opener 없음');
    return;
  }

  try {
    window.opener.postMessage(
      {
        type: 'SOCIAL_LOGIN_RESULT',
        success,
      },
      '*',
    );
  } catch (e) {
    console.error('[SocialRedirect] SOCIAL_LOGIN_RESULT postMessage 실패:', e);
  }
};

const closePopup = () => {
  setTimeout(() => {
    try {
      window.close();
    } catch (e) {
      console.warn('[SocialRedirect] window.close 실패:', e);
    }
  }, 300);
};

onMounted(() => {
  const search = window.location.search;
  const params = new URLSearchParams(search);

  const successParam = params.get('success');
  const hasSuccessParam = successParam !== null;
  const successFromParam = successParam === 'true';

  logToOpener('SocialRedirect.mounted', {
    href: window.location.href,
    search,
    hasOpener: !!window.opener,
    hasSuccessParam,
    successParam,
  });

  if (!window.opener) {
    console.warn('[SocialRedirect] opener 없음 - 직접 접속으로 판단, 메인으로 이동');
    closePopup();
    return;
  }

  const assumedSuccess = hasSuccessParam ? successFromParam : true;

  if (!assumedSuccess) {
    logToOpener('SocialRedirect.result-fail', { hasSuccessParam, successFromParam });
    notifyResult(false);
    closePopup();
    return;
  }

  logToOpener('SocialRedirect.result-success', { hasSuccessParam, successFromParam });
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
