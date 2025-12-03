<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';

const notifyResult = (success) => {
  if (!window.opener) {
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
    console.error('[SocialRedirect] Failed to post message to opener window:', e);
  }
};

const closePopup = () => {
  setTimeout(() => {
    try {
      window.close();
    } catch {
      // ignore close failures
    }
  }, 300);
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);

  const successParam = params.get('success');
  const hasSuccessParam = successParam !== null;
  const successFromParam = successParam === 'true';

  if (!window.opener) {
    closePopup();
    return;
  }

  const assumedSuccess = hasSuccessParam ? successFromParam : true;

  notifyResult(assumedSuccess);
  closePopup();
});
</script>

<style scoped>
.redirect {
  padding: 40px;
  text-align: center;
}
</style>
