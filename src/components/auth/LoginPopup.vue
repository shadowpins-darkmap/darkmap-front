<template>
  <div class="form_wrap">
    <div class="top_logo_img_wrap">
      <img width="146" height="152" src="@/assets/loginLogoImg.svg" alt="login logo image" />
    </div>
    <div class="login_buttons_wrap">
      <button class="yellow_button" @click="handleSocialLogin('kakao')">
        <img width="20" height="18" src="@/assets/kakaoIcon.svg" alt="kakao icon" class="kakao_icon" />
        카카오로 계속하기
      </button>
      <button class="black_button" @click="handleSocialLogin('google')">
        Google 계정으로 계속하기
      </button>
    </div>
  </div>

  <BaseAlertPopup v-if="showLoginFailAlert" @confirm="showLoginFailAlert = false" confirmText="확인" height="169px">
    <p>로그인/가입에 실패했습니다.<br /> 정보를 다시 확인해주세요.</p>
  </BaseAlertPopup>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, defineEmits } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import { debounce } from 'lodash';
import BaseAlertPopup from '@/components/BaseAlert.vue';
// import { wait } from '@/utils/date';

const emit = defineEmits(['login-success', 'close']);
const auth = useAuthStore();

let popupRef = null;
let popupCheckInterval = null;
let loginProcessing = false;

const showLoginFailAlert = ref(false);

const clearPopupWatcher = () => {
  if (popupCheckInterval) {
    clearInterval(popupCheckInterval);
    popupCheckInterval = null;
  }
};

const closePopup = () => {
  if (popupRef && !popupRef.closed) {
    popupRef.close();
  }
  popupRef = null;
  clearPopupWatcher();
};



const processLoginSuccess = async () => {
  if (loginProcessing) return;
  loginProcessing = true;
  try {
    const userData = await userApi.getMe();
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

const handleSocialLoginMessage = async (event) => {
  if (event.origin !== window.location.origin) return;
  const { type, success } = event.data || {};
  if (type !== 'SOCIAL_LOGIN_RESULT') return;

  if (!success) {
    showLoginFailAlert.value = true;
    closePopup();
    return;
  }

  await processLoginSuccess();
  closePopup();
};

const checkPopupClosed = () => {
  clearPopupWatcher();
  popupCheckInterval = setInterval(() => {
    const isClosed = popupRef && popupRef.closed;
    if (isClosed) {
      closePopup();
    }
  }, 1000);
};

const handleSocialLogin = debounce(async (provider) => {
  console.log('소셜 로그인 시작:', provider);
  const loginUrl =
    provider === 'kakao'
      ? `/api/v1/auth/login/kakao`
      : `/api/v1/auth/login/google`;

  popupRef = window.open(loginUrl, '소셜로그인', 'width=500,height=700');

  if (!popupRef) {
    alert('팝업이 차단되었습니다. 팝업 허용을 켜주세요.');
    return;
  }

  checkPopupClosed();
}, 300);


onMounted(() => {
  window.addEventListener('message', handleSocialLoginMessage);
});


onBeforeUnmount(() => {
  window.removeEventListener('message', handleSocialLoginMessage);
  if (popupRef && !popupRef.closed) {
    popupRef.close();
  }
  popupRef = null;
  clearPopupWatcher();
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
