<template>
  <router-view v-if="isAppReady" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useStatsStore } from '@/store/useStatsStore';
import { useAuthStore } from '@/store/useAuthStore';

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

onMounted(async () => {
  window.addEventListener('auth:refresh-failed', handleRefreshFailed);

  if (window.opener && isSocialRedirectPath) {
    isAppReady.value = true;
    return;
  }

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

.scroll_area::-webkit-scrollbar:hover {
  width: 10px;
  height: 10px;
}

.scroll_area::-webkit-scrollbar-button {
  display: none;
}

.scroll_area::-webkit-scrollbar-thumb {
  background-color: #ffefeb;
  border-radius: 6px;
}

/* 스크롤바 뒷 배경 설정*/
.scroll_area::-webkit-scrollbar-track {
  background-color: rgba(255, 239, 235, 0.65);
  border-radius: 6px;
}

/* 스크롤바 뒷 배경 설정*/
/* .scroll_area::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: transparent;
}
.scroll_area::-webkit-scrollbar-track:hover {
  background-color: transparent;
}
.scroll_area::-webkit-scrollbar-button {
  display: none;
} */
</style>
