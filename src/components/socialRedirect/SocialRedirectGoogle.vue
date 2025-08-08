<template>
  <div class="redirect">
    <p>로그인 정보를 확인 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
console.log('[index] href:', location.href);

// const PARENT_ORIGIN = 'https://darkmap-pi.vercel.app'; // prod
// const PARENT_ORIGIN = 'http://localhost:8080'; // dev
onMounted(() => {
  document.title = 'redirecting...';
  const qs = new URLSearchParams(window.location.search);
  console.log('qs : ', qs);

  const success = qs.get('success') === 'true';
  const accessToken = qs.get('token') || qs.get('accessToken');
  const refreshToken =
    qs.get('refreshToken') || qs.get('refresh_token') || null;

  // 부모창으로 메시지 전송
  if (window.opener) {
    // window.opener.postMessage({ success, accessToken, refreshToken }, '*');
    // window.opener.postMessage(
    //   { success, accessToken, refreshToken },
    //   PARENT_ORIGIN,
    // );
    window.opener.postMessage(
      { type: 'SOCIAL_LOGIN_RESULT', success, accessToken, refreshToken },
      'https://darkmap-pi.vercel.app',
    );
  }

  // 약간의 여유를 두고 창 닫기
  setTimeout(() => {
    window.close();
  }, 100);
});
</script>
