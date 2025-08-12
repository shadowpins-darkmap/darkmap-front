<template>
  <div class="redirect">
    <p>{{ status }}</p>
    <small>href: {{ href }}</small>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const status = ref('로그인 정보 확인중…');
const href = window.location.href;

function pingParent(type, payload = {}) {
  try {
    if (window.opener) {
      window.opener.postMessage({ type, ...payload }, '*'); // 테스트 용으로 *
    }
  } catch (e) {
    // eslint-disable-next-line no-alert
    // alert('postMessage error: ' + (e?.message || e));
  }
}

onMounted(async () => {
  document.title = '[mounted] redirecting…';
  status.value = '✅ onMounted 진입';
  pingParent('REDIRECT_MOUNTED');

  const url = new URL(window.location.href);
  const code = url.searchParams.get('code');

  if (!code) {
    status.value = '❌ code 파라미터 없음';
    pingParent('NO_CODE');
    return;
  }

  status.value = `🔎 code 발견: ${code.slice(0, 8)}…`;
  pingParent('CODE_FOUND', { code });

  try {
    status.value = '🔁 토큰 교환 요청 중…';
    const res = await fetch(
      `https://api.kdark.weareshadowpins.com/api/v1/auth/login/kakao/callback?code=${code}`,
      {
        // 쿠키 사용해야 한다면 백엔드 CORS/SameSite 설정에 맞춰 아래 사용
        // credentials: 'include',
      },
    );

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      status.value = `🚫 교환 실패: ${res.status}`;
      pingParent('EXCHANGE_FAILED', { status: res.status, text });
      return;
    }

    const data = await res.json().catch(() => ({}));
    status.value = '✅ 토큰 수신';
    document.title = '[ok] tokens received';

    const { accessToken, refreshToken } = data || {};
    pingParent('TOKENS_RECEIVED', {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
    });

    // 부모 창에 토큰 전달
    if (window.opener && accessToken) {
      pingParent('SENDING_TO_PARENT');
      window.opener.postMessage(
        {
          type: 'SOCIAL_LOGIN_RESULT',
          success: true,
          accessToken,
          refreshToken,
        },
        '*', // 테스트 용: 수신되는지 먼저 확인 → 되면 정확한 origin으로 바꾸기
      );
      status.value = '📨 부모에 전달 완료, 창 닫기 준비…';
    } else {
      status.value = '⚠️ accessToken 부재 또는 opener 없음';
      pingParent('NO_OPENER_OR_TOKEN');
    }

    setTimeout(() => window.close(), 500);
  } catch (err) {
    status.value = '💥 예외 발생(콘솔 확인)';
    console.error('🚫 토큰 교환 실패:', err);
    pingParent('EXCEPTION', { message: String(err) });
  }
});
</script>
