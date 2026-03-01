<template>
  <div class="login_modal_backdrop" @click.self="handleClose">
    <div class="login_modal">
      <button
        class="login_close_button"
        @click="handleClose"
        aria-label="로그인 창 닫기"
      >
        ✕
      </button>
      <div class="form_wrap">
        <div class="top_logo_img_wrap">
          <img
            width="146"
            height="152"
            src="@/assets/loginLogoImg.svg"
            alt="login logo image"
          />
        </div>
        <div class="login_buttons_wrap">
          <button
            class="yellow_button"
            @click="handleSocialLogin(OAUTH_PROVIDERS.KAKAO)"
          >
            <img
              width="20"
              height="18"
              src="@/assets/kakaoIcon.svg"
              alt="kakao icon"
              class="kakao_icon"
            />
            카카오로 계속하기
          </button>
          <button
            class="black_button"
            @click="handleSocialLogin(OAUTH_PROVIDERS.GOOGLE)"
          >
            Google 계정으로 계속하기
          </button>
        </div>
      </div>
      <div v-if="isLoading" class="login_loader_overlay">
        <BaseLoader />
        <p>{{ loaderMessage }}</p>
      </div>
    </div>
    <BaseAlertPopup
      v-if="showLoginFailAlert"
      @confirm="showLoginFailAlert = false"
      :title="loginFailTitle"
      confirmText="확인"
      :height="loginFailTitle ? '196px' : '169px'"
    >
      <p class="login_fail_message">{{ loginFailMessage }}</p>
    </BaseAlertPopup>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { debounce } from 'lodash';
import { OAUTH_PROVIDERS, getOAuthLoginUrl } from '@/utils/oauth';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import { RECENT_LOGIN_INFO_KEY } from '@/constant/storage';
import { openOAuthPopup } from '@/lib/oauthPopup';
import { API_BASE_URL, BASE_URL } from '@/constant/url';

const emit = defineEmits(['close']);

const isLoading = ref(false);
const showLoginFailAlert = ref(false);
const loginFailTitle = ref('');
const loginFailMessage = ref(
  '로그인/가입에 실패했습니다.\n정보를 다시 확인해주세요.',
);
const loaderMessage = ref('로그인 창을 여는 중이에요...');

const router = useRouter();
const auth = useAuthStore();

const persistRecentLoginInfo = (userData) => {
  if (!userData) {
    return;
  }

  sessionStorage.setItem(
    RECENT_LOGIN_INFO_KEY,
    JSON.stringify({
      nickname: userData.nickname,
      loginCount: userData.loginCount,
      marketingAgreed:
        typeof userData.marketingAgreed === 'boolean'
          ? userData.marketingAgreed
          : null,
    }),
  );
};

const resolveLoginError = (error) => {
  const payload =
    error?.payload || error?.detail?.payload || error?.detail || {};
  const code = error?.code || payload?.error || error?.error || null;
  const message =
    error?.message ||
    payload?.message ||
    payload?.error ||
    '로그인/가입에 실패했습니다.\n정보를 다시 확인해주세요.';

  return { code, message };
};

const triggerLoginFailAlert = (error) => {
  const { code, message } = resolveLoginError(error);
  if (code === 'WITHDRAWN_MEMBER') {
    auth.clearAccessToken();
    if (message === 'WITHDRAWN_MEMBER' || !message) {
      loginFailTitle.value = '가입이 불가합니다.';
      loginFailMessage.value =
        '탈퇴한 회원의 재가입은\n일주일 이상 시일 경과 후에만 가능해요.';
      showLoginFailAlert.value = true;
      isLoading.value = false;
      return;
    }
  }

  loginFailTitle.value = '';
  loginFailMessage.value = message;
  console.error('[LoginPage] 소셜 로그인 실패:', error);
  showLoginFailAlert.value = true;
  isLoading.value = false;
};

const handleClose = () => {
  if (isLoading.value) {
    return;
  }
  emit('close');
};

const allowedOrigins = (() => {
  const origins = new Set();
  if (typeof window !== 'undefined') {
    origins.add(window.location.origin);
  }

  [API_BASE_URL, BASE_URL].forEach((url) => {
    if (!url) return;
    try {
      const origin = new URL(url).origin;
      origins.add(origin);
    } catch (error) {
      console.warn(
        '[LoginPage] 잘못된 URL로 인해 origin을 계산하지 못했습니다:',
        url,
      );
    }
  });

  return Array.from(origins);
})();

const handleHashError = (event) => {
  triggerLoginFailAlert(event?.detail || event);
};

onMounted(() => {
  window.addEventListener('auth:hash-error', handleHashError);
});

onBeforeUnmount(() => {
  window.removeEventListener('auth:hash-error', handleHashError);
});

const authenticateWithProvider = async (provider) => {
  try {
    const loginUrl = getOAuthLoginUrl(provider);
    loaderMessage.value = '로그인 창을 여는 중이에요...';
    isLoading.value = true;

    const authResponse = await openOAuthPopup(loginUrl, {
      targetOrigins: allowedOrigins,
    });

    auth.setTokens(authResponse);

    let userData = authResponse?.member;
    if (!userData) {
      loaderMessage.value = '사용자 정보를 확인 중이에요...';
      userData = await userApi.getMe();
    }

    if (!userData) {
      throw new Error('사용자 정보를 불러오지 못했습니다.');
    }

    auth.setAuthenticated(userData);
    persistRecentLoginInfo(userData);
    loaderMessage.value = '메인 페이지로 이동 중이에요...';
    await router.replace('/');
  } catch (error) {
    triggerLoginFailAlert(error);
  } finally {
    isLoading.value = false;
    loaderMessage.value = '로그인 창을 여는 중이에요...';
  }
};

const handleSocialLogin = debounce(
  (provider) => {
    authenticateWithProvider(provider);
  },
  300,
  { leading: true, trailing: false },
);
</script>

<style scoped>
.login_modal_backdrop {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}

.login_modal {
  position: relative;
  background: #6d54ce;
  border-radius: 32px;
  padding: 40px 24px 48px;
  width: min(480px, 90vw);
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.3);
}

.login_close_button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 18px;
}

.form_wrap {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
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
  inset: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  gap: 12px;
  color: #fff;
  text-align: center;
}

.login_fail_message {
  white-space: pre-line;
}
</style>
