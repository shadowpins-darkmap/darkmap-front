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
  console.log('Social login redirect loaded with success:', {
    params,
    success,
  });
  if (!success) {
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

  if (window.opener) {
    window.opener.postMessage(
      {
        type: 'SOCIAL_LOGIN_RESULT',
        success: true,
      },
      BASE_URL
    );
  }

  setTimeout(() => {
    window.close();
  }, 3000000000);
});
</script>
