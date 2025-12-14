<template>
  <div class="login_wrapper">
    <div class="form_wrap">
      <div class="top_logo_img_wrap">
        <img width="146" height="152" src="@/assets/loginLogoImg.svg" alt="login logo image" />
      </div>
      <div class="login_buttons_wrap">
        <button class="yellow_button" @click="handleSocialLogin(OAUTH_PROVIDERS.KAKAO)">
          <img width="20" height="18" src="@/assets/kakaoIcon.svg" alt="kakao icon" class="kakao_icon" />
          카카오로 계속하기
        </button>
        <button class="black_button" @click="handleSocialLogin(OAUTH_PROVIDERS.GOOGLE)">
          Google 계정으로 계속하기
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="login_loader_overlay">
      <BaseLoader />
      <p>{{ loaderMessage }}</p>
    </div>
  </div>
  <BaseAlertPopup v-if="showLoginFailAlert" @confirm="showLoginFailAlert = false" confirmText="확인" height="169px">
    <p>로그인/가입에 실패했습니다.<br /> 정보를 다시 확인해주세요.</p>
  </BaseAlertPopup>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash';
import { OAUTH_PROVIDERS, getOAuthLoginUrl } from '@/utils/oauth';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import { RECENT_LOGIN_INFO_KEY } from '@/constant/storage';

const isLoading = ref(false);
const showLoginFailAlert = ref(false);
const loaderMessage = ref('로그인 페이지로 이동 중이에요...');

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const clearAuthCallbackQuery = async () => {
  const nextQuery = { ...route.query };
  delete nextQuery.success;
  delete nextQuery.error;
  await router.replace({ query: nextQuery });
};

const persistRecentLoginInfo = (userData) => {
  sessionStorage.setItem(
    RECENT_LOGIN_INFO_KEY,
    JSON.stringify({
      nickname: userData.nickname,
      loginCount: userData.loginCount,
    }),
  );
};

const triggerLoginFailAlert = (error) => {
  console.error('[LoginPage] 소셜 로그인 시작 실패:', error);
  showLoginFailAlert.value = true;
  isLoading.value = false;
};

const handleSocialLogin = debounce((provider) => {
  try {
    const loginUrl = getOAuthLoginUrl(provider);

    isLoading.value = true;
    window.location.href = loginUrl;
  } catch (error) {
    triggerLoginFailAlert(error);
  }
}, 300);

let isHandlingOAuth = false;

const handleOAuthCallback = async () => {
  if (isHandlingOAuth) {
    return;
  }

  const { success, error: errorMessage } = route.query;

  if (success === undefined) {
    return;
  }

  isHandlingOAuth = true;

  if (success !== 'true') {
    triggerLoginFailAlert(new Error(errorMessage || '로그인에 실패했습니다.'));
    await clearAuthCallbackQuery();
    return;
  }

  loaderMessage.value = '로그인 처리 중이에요...';
  isLoading.value = true;

  try {
    const userData = await userApi.getMe();

    if (!userData) {
      throw new Error('사용자 정보를 불러오지 못했습니다.');
    }

    auth.setAuthenticated(userData);
    persistRecentLoginInfo(userData);
    await router.replace('/');
  } catch (error) {
    triggerLoginFailAlert(error);
    await clearAuthCallbackQuery();
  } finally {
    isLoading.value = false;
    loaderMessage.value = '로그인 페이지로 이동 중이에요...';
    isHandlingOAuth = false;
  }
};

watch(
  () => route.query.success,
  () => {
    handleOAuthCallback();
  },
  { immediate: true },
);
</script>

<style scoped>
.login_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #6d54ce;
  position: relative;
}

.form_wrap {
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
}

.top_logo_img_wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.login_buttons_wrap {
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 12px;
}

.black_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  background-color: #000;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  height: 48px;
  min-width: 170px;
  border-radius: 40px;
  border: 2px solid #f1cfc8;
}

.yellow_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  background-color: #fee500;
  color: #000;
  font-weight: 700;
  font-size: 16px;
  height: 48px;
  min-width: 170px;
  border-radius: 40px;
  border: 2px solid #fee500;
}

.kakao_icon {
  margin-right: 5px;
}

.login_loader_overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  gap: 12px;
  color: #fff;
  text-align: center;
}
</style>
