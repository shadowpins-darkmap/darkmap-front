<template>
  <div class="redirect">
    <p>로그인 처리 중...</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { userApi } from '@/api/user';
import { useAuthStore } from '@/store/useAuthStore';
import { BASE_URL } from '@/constant/url';

const authStore = useAuthStore();

const parseOrigin = (url) => {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch (error) {
    console.warn('Failed to parse origin from URL:', url, error);
    return null;
  }
};

const getCandidateOrigins = () => {
  const candidates = [
    window.location?.origin,
    parseOrigin(document.referrer),
    parseOrigin(BASE_URL),
  ].filter(Boolean);

  return Array.from(new Set(candidates));
};

const notifyOpener = (payload) => {
  if (!window.opener) return;

  const origins = [...getCandidateOrigins(), '*'];
  for (const origin of origins) {
    try {
      window.opener.postMessage(payload, origin);
      return;
    } catch (error) {
      console.warn(`postMessage failed for origin ${origin}:`, error);
    }
  }
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
      user: userData,
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
