<template>
  <div class="redirect">
    <p>로그인 정보를 확인 중입니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(async () => {
  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');

  if (!code) {
    console.error('❌ code 누락됨');
    return;
  }

  try {
    const res = await fetch(
      `https://api.kdark.weareshadowpins.com/api/v1/auth/login/kakao/callback?code=${code}`,
    );

    const data = await res.json();
    console.log('✅ 받은 토큰:', data);

    const { accessToken, refreshToken } = data;

    // 부모 창에 토큰 전달
    if (window.opener && accessToken) {
      window.opener.postMessage(
        {
          accessToken,
          refreshToken,
        },
        '*',
      );
    }

    // 창 닫기
    setTimeout(() => {
      window.close();
    }, 1000);
  } catch (err) {
    console.error('🚫 토큰 교환 실패:', err);
  }
});
</script>
