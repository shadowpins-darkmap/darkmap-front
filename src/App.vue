<template>
  <router-view v-if="isAppReady" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStatsStore } from '@/store/useStatsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { consumeAuthPayloadFromHash } from '@/utils/authPayload';

const isAppReady = ref(false);
const isSocialRedirectPath = window.location.pathname.startsWith('/social-redirect');

const router = useRouter();
const statsStore = useStatsStore();
const authStore = useAuthStore();

const handleRefreshFailed = () => {
  console.warn('세션이 만료되어 로그인 페이지로 이동합니다.');
  if (router.currentRoute.value.path !== '/login') {
    router.replace('/login');
  }
};

const handleAuthPayloadFromHash = () => {
  const result = consumeAuthPayloadFromHash();
  if (!result) {
    return;
  }

  if (result.type === 'success') {
    authStore.setTokens(result.data);
    if (result.data?.member) {
      authStore.setAuthenticated(result.data.member);
    }
    return;
  }

  console.error('[App] OAuth 해시 인증 처리 실패:', result.data);
  window.dispatchEvent(new CustomEvent('auth:hash-error', { detail: result.data }));
  if (router.currentRoute.value.path !== '/login') {
    router.replace('/login');
  }
};

const bridgeAuthPayloadToOpener = () => {
  if (!window.opener) {
    return;
  }

  const result = consumeAuthPayloadFromHash();
  if (!result) {
    window.opener.postMessage(
      {
        type: 'OAUTH_ERROR',
        payload: { message: '인증 정보를 확인할 수 없습니다.' },
      },
      '*',
    );
    window.close();
    return;
  }

  window.opener.postMessage(
    {
      type: result.type === 'success' ? 'OAUTH_SUCCESS' : 'OAUTH_ERROR',
      payload: result.data,
    },
    '*',
  );
  window.close();
};

onMounted(async () => {
  window.addEventListener('auth:refresh-failed', handleRefreshFailed);

  if (window.opener && isSocialRedirectPath) {
    bridgeAuthPayloadToOpener();
    isAppReady.value = true;
    return;
  }

  handleAuthPayloadFromHash();

  try {
    await authStore.restoreSession();
    statsStore.fetchStats();
  } finally {
    isAppReady.value = true;
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('auth:refresh-failed', handleRefreshFailed);
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');

html,
body,
#app {
  font-family: 'Noto Sans KR', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

/* reset css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

button {
  background-color: transparent;
  border: none;
  cursor: pointer;
}

a,
img,
fieldset {
  text-decoration: none;
  vertical-align: top;
  outline: 1;
  border: none;
}

ul,
ol,
li {
  list-style: none;
}

textarea {
  resize: none;
}

/* 전역 공통 클래스 */
/* 하이라이팅 */
mark {
  background-color: #00ffc2 !important;
  color: #006850 !important;
  font-weight: bold;
  padding: 0 2px;
}

/* 한 줄 생략 (...) */
.ellipsis__1 {
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  /* 줄 수를 여기서 조절 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 여러 줄 생략 (...) — 기본 두 줄 */
.ellipsis__2 {
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

/* scroll reset 전역 커스텀 스크롤 */
.scroll_area {
  overflow-y: auto;
  overflow-x: hidden;
  height: fit-content;
  scrollbar-color: transparent transparent; /* Firefox: hidden by default */
}
.scroll_area:hover {
  scrollbar-color: #ffefeb transparent; /* Firefox: show on hover */
}

.scroll_area_wrap {
  padding: 24px 0;
  padding-right: 6px;
}

/* 스크롤바 막대 설정*/
.scroll_area::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.scroll_area::-webkit-scrollbar-button {
  display: none;
}

/* Default: transparent (invisible) */
.scroll_area::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 6px;
}
.scroll_area::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 6px;
}

/* On hover: show peach scrollbar */
.scroll_area:hover::-webkit-scrollbar-thumb {
  background-color: #ffefeb;
}
.scroll_area:hover::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
