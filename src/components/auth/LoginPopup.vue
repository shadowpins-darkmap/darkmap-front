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

  <BaseAlertPopup v-if="showWelcomeAlert" @confirm="handleWelcomeConfirm" confirmText="확인" height="169px">
    <p style="margin-top: 6px;">{{ nickname }}님 다시 오셨네요! <br /> {{ loginCount }}번째 투어에요.</p>
  </BaseAlertPopup>

  <NicknameStep v-if="showNicknameStep" :nickname="nickname" @submit="handleNicknameSubmit" />

  <FirstVisitStep v-if="showFirstVisitStep" :nickname="nickname" @confirm="handleFirstVisitConfirm" />

  <MarketingConsentStep v-if="showMarketingStep" @agree="handleMarketingAgree" @skip="handleMarketingSkip" />


</template>

<script setup>
import { onBeforeUnmount, ref, defineEmits } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import { debounce } from 'lodash';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import NicknameStep from '@/components/onboarding/NicknameStep.vue';
import FirstVisitStep from '@/components/onboarding/FirstVisitStep.vue';
import MarketingConsentStep from '@/components/onboarding/MarketingConsentStep.vue';


const emit = defineEmits(['close']);
const auth = useAuthStore();

const TRUSTED_ORIGINS = [
  'https://darkmap-pi.vercel.app',
  'http://localhost:8080',
];
let popupRef = null;

const showLoginFailAlert = ref(false);
const showWelcomeAlert = ref(false);
const showNicknameStep = ref(false);
const showFirstVisitStep = ref(false);
const showMarketingStep = ref(false);


const nickname = ref('');
const loginCount = ref(0);

const receiveMessage = async (event) => {
  if (!TRUSTED_ORIGINS.includes(event.origin)) return;
  if (event.source !== popupRef) return;
  if ((event.data || {}).type !== 'SOCIAL_LOGIN_RESULT') return;

  const { success, accessToken } = event.data;

  // 팝업 정리
  window.removeEventListener('message', receiveMessage);
  if (popupRef && !popupRef.closed) {
    popupRef.close();
  }
  popupRef = null;

  if (!success || !accessToken) {
    showLoginFailAlert.value = true;
    return;
  }

  try {
    auth.loginWithTokens(accessToken);
    const userData = await userApi.getMe();

    nickname.value = userData.nickname;
    loginCount.value = userData.loginCount;

    if (userData.loginCount >= 2) {
      showWelcomeAlert.value = true;
    } else {
      showNicknameStep.value = true;
    }
  } catch (error) {
    console.error('로그인 처리 실패:', error);
    showLoginFailAlert.value = true;
  }
};

const handleSocialLogin = debounce((provider) => {
  const loginUrl =
    provider === 'kakao'
      ? `https://api.kdark.weareshadowpins.com/api/v1/auth/login/kakao`
      : 'https://api.kdark.weareshadowpins.com/oauth2/authorization/google';

  popupRef = window.open(loginUrl, '소셜로그인', 'width=500,height=700');

  if (!popupRef) {
    alert('팝업이 차단되었습니다. 팝업 허용을 켜주세요.');
    return;
  }

  window.addEventListener('message', receiveMessage);
}, 300);

const handleWelcomeConfirm = () => {
  showWelcomeAlert.value = false;
  emit('close');
};

const handleNicknameSubmit = (newNickname) => {
  nickname.value = newNickname;
  showNicknameStep.value = false;
  showFirstVisitStep.value = true;
};

const handleFirstVisitConfirm = () => {
  showFirstVisitStep.value = false;
  showMarketingStep.value = true;
};

const handleMarketingAgree = () => {
  showMarketingStep.value = false;
  emit('close');
};

const handleMarketingSkip = () => {
  showMarketingStep.value = false;
  emit('close');
};

onBeforeUnmount(() => {
  window.removeEventListener('message', receiveMessage);
  if (popupRef && !popupRef.closed) {
    popupRef.close();
  }
  popupRef = null;
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