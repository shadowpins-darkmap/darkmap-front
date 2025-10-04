<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

// TODO: 배포 주소 메인 도메인으로 변경필요
const PARENT_ORIGIN = 'https://darkmap-pi.vercel.app';

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
        PARENT_ORIGIN
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
      PARENT_ORIGIN
    );
  }

  setTimeout(() => {
    window.close();
  }, 300);
});
</script>