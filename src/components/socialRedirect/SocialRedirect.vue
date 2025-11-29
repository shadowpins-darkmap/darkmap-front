<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { BASE_URL } from '@/constant/url';
import { userApi } from '@/api/user';
import { useAuthStore } from '@/store/useAuthStore';

const authStore = useAuthStore();

const getTargetOrigin = () => window.location?.origin || BASE_URL;
const notifyOpener = (payload) => {
  if (!window.opener) return;
  window.opener.postMessage(payload, getTargetOrigin());
};

const closePopup = () => {
  setTimeout(() => {
    window.close();
  }, 500);
};

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success') === 'true';
  console.log('Social login redirect loaded with success:', {
    params,
    success,
  });

  if (!success) {
    notifyOpener({
      type: 'SOCIAL_LOGIN_RESULT',
      success: false,
    });
    closePopup();
    return;
  }

  try {
    const userData = await userApi.getMe();
    authStore.setAuthenticated(userData);
    notifyOpener({
      type: 'SOCIAL_LOGIN_RESULT',
      success: true,
      user: {
        nickname: userData.nickname,
        loginCount: userData.loginCount,
      },
    });
    notifyOpener({ type: 'OAUTH_POPUP_LOADED' });
  } catch (error) {
    console.error('Failed to fetch user info after social login:', error);
    notifyOpener({
      type: 'SOCIAL_LOGIN_RESULT',
      success: false,
      error: 'GET_ME_FAILED',
    });
  } finally {
    closePopup();
  }
});
</script>
