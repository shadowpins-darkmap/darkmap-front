<template>
  <div class="redirect">
    <p>{{ status }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const status = ref('로그인 정보 확인중…');

const PARENT_ORIGIN = 'https://darkmap-pi.vercel.app';

onMounted(() => {
  status.value = '✅ onMounted 진입';

  // 1) 쿼리에서 토큰/성공여부 파싱
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success') === 'true';
  const accessToken = params.get('token'); // 서버가 token으로 내려줌

  if (!success || !accessToken) {
    status.value = '❌ token 없음 또는 success=false';
    return;
  }

  // 2) 저장
  localStorage.setItem('accessToken', accessToken);
  status.value = '💾 토큰 저장 완료';

  // 3) 부모 창에 알림 (먼저 잘 받는지 확인하려면 '*'로 테스트 후 PARENT_ORIGIN으로 바꾸세요)
  try {
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'SOCIAL_LOGIN_RESULT',
          success: true,
          accessToken,
        },
        PARENT_ORIGIN,
        // '*',
      );
      status.value = '📨 부모창에 전달 완료';
    } else {
      status.value = '⚠️ opener 없음(부모창을 못 찾음)';
    }
  } catch (e) {
    console.error('postMessage error:', e);
  }

  // 4) 창 닫기
  setTimeout(() => {
    window.close();
  }, 300);
});
</script>
