<template>
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

  <BaseAlertPopup v-if="showLoginFailAlert" @confirm="showLoginFailAlert = false" confirmText="확인" height="169px">
    <p>로그인/가입에 실패했습니다.<br /> 정보를 다시 확인해주세요.</p>
  </BaseAlertPopup>
</template>

<script setup>
import { defineEmits, onMounted, onBeforeUnmount, ref } from 'vue';
import { debounce } from 'lodash';
import { getOAuthLoginUrl, OAUTH_PROVIDERS } from '@/utils/oauth';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import BaseAlertPopup from '@/components/BaseAlert.vue';

const emit = defineEmits(['login-success', 'close']);
const auth = useAuthStore();

const showLoginFailAlert = ref(false);
let popupRef = null;
let popupCloseInterval = null;
let loginProcessing = false;

const clearPopupCloseWatcher = () => {
  if (popupCloseInterval) {
    clearInterval(popupCloseInterval);
    popupCloseInterval = null;
  }
};

const closePopup = () => {
  if (popupRef && !popupRef.closed) {
    popupRef.close();
  }
  popupRef = null;
  clearPopupCloseWatcher();
};

const processLoginSuccess = async () => {
  if (loginProcessing) return;
  loginProcessing = true;

  try {
    const userData = await userApi.getMe(); // 쿠키 기반 /me
    auth.setAuthenticated(userData);
    emit('login-success', { nickname: userData.nickname, loginCount: userData.loginCount });
    emit('close');
  } catch (error) {
    console.error('로그인 처리 실패:', error);
    showLoginFailAlert.value = true;
  } finally {
    loginProcessing = false;
  }
};

// 팝업이 사용자에 의해 그냥 닫혔는지만 확인하는 watcher (선택)
const startPopupCloseWatcher = () => {
  clearPopupCloseWatcher();
  popupCloseInterval = setInterval(() => {
    if (popupRef && popupRef.closed) {
      // 로그인 없이 닫힌 케이스
      closePopup();
      // 필요하면 여기서 "로그인 취소" 토스트 띄우기 등
    }
  }, 500);
};

// postMessage 수신 핸들러
const handleOAuthMessage = async (event) => {
  // 보안: 우리 도메인에서 온 메시지만 처리
  if (event.origin !== window.location.origin) return;

  if (event.data?.type === 'OAUTH_SUCCESS') {
    // 서버에서 쿠키 세팅 완료된 상태라고 가정하고 /me 호출
    await processLoginSuccess();
    closePopup();
  }

  if (event.data?.type === 'OAUTH_FAIL') {
    closePopup();
    showLoginFailAlert.value = true;
  }
};

const handleSocialLogin = debounce((provider) => {
  console.log('소셜 로그인 시작:', provider);
  const loginUrl = getOAuthLoginUrl(provider);

  if (!loginUrl) {
    showLoginFailAlert.value = true;
    return;
  }

  popupRef = window.open(loginUrl, '소셜로그인', 'width=500,height=700');

  if (!popupRef) {
    showLoginFailAlert.value = true;
    return;
  }

  startPopupCloseWatcher();
}, 300);

onMounted(() => {
  window.addEventListener('message', handleOAuthMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handleOAuthMessage);
  closePopup();
});
</script>

<style scoped>
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
</style>