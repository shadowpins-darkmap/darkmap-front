<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { BASE_URL } from '@/constant/url';
import { onMounted } from 'vue';

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success') === 'true';
  const accessToken = params.get('token');

  if (!success || !accessToken) {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'SOCIAL_LOGIN_RESULT',
          success: false,
        },
        BASE_URL
      );
    }
    window.close();
    return;
  }

  localStorage.setItem('accessToken', accessToken);

  if (window.opener) {
    window.opener.postMessage(
      {
        type: 'SOCIAL_LOGIN_RESULT',
        success: true,
        accessToken,
      },
      BASE_URL
    );
  }

  setTimeout(() => {
    window.close();
  }, 300);
});
</script>