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
import { OAUTH_PROVIDERS } from '@/utils/oauth';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import BaseAlertPopup from '@/components/BaseAlert.vue';

const emit = defineEmits(['login-success', 'close']);
const auth = useAuthStore();

const showLoginFailAlert = ref(false);
let popupRef = null;
let popupCloseInterval = null;


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



const startPopupWatcher = () => {
  clearPopupCloseWatcher();
  popupCloseInterval = setInterval(() => {
    if (popupRef && popupRef.closed) {
      console.log('팝업 닫힘 - 로그인 취소');
      closePopup();
    }
  }, 1000);
};

const handleOAuthMessage = async (event) => {
  console.log('[LoginPopup] message event:', event.origin, event.data);

  if (event.data?.type === 'SOCIAL_LOGIN_DEBUG') {
    console.log('[SocialRedirect DEBUG]', event.data.message, event.data.extra);
    return;
  }

  if (event.data?.type === 'SOCIAL_LOGIN_RESULT') {
    if (!event.data.success) {
      showLoginFailAlert.value = true;
      closePopup();
      return;
    }

    try {
      const userData = await userApi.getMe();
      auth.setAuthenticated(userData);
      emit('login-success', {
        nickname: userData.nickname,
        loginCount: userData.loginCount,
      });
      emit('close');
    } catch (error) {
      console.error('SOCIAL_LOGIN_RESULT 처리 실패:', error);
      showLoginFailAlert.value = true;
    } finally {
      closePopup();
    }
    return;
  }

  if (event.data?.type === 'OAUTH_POPUP_LOADED') {
    console.log('📬 OAuth 팝업 로드 완료 - /me 호출');
    try {
      const userData = await userApi.getMe();
      auth.setAuthenticated(userData);
      emit('login-success', { nickname: userData.nickname, loginCount: userData.loginCount });
      emit('close');
    } catch {
      showLoginFailAlert.value = true;
    } finally {
      closePopup();
    }
  }
};

const handleSocialLogin = debounce((provider) => {
  console.log('소셜 로그인 시작:', provider);

  const popupUrl = `/social-login-start?provider=${provider}`;
  popupRef = window.open(
    popupUrl,
    '소셜로그인',
    'width=500,height=700'
  );

  if (!popupRef) {
    showLoginFailAlert.value = true;
    return;
  }


  startPopupWatcher();
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
