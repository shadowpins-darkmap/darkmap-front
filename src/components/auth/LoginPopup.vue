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
import { onBeforeUnmount, ref } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import { debounce } from 'lodash';
import BaseAlertPopup from '@/components/BaseAlert.vue';

const auth = useAuthStore();

let popupRef = null;

const showLoginFailAlert = ref(false);

const checkPopupClosed = async () => {
  const interval = setInterval(async () => {
    let isClosed = false;
    isClosed = popupRef && popupRef.closed;
    if (isClosed) {
      clearInterval(interval);

      const accessToken = localStorage.getItem('accessToken');

      if (accessToken) {
        try {
          auth.loginWithTokens(accessToken);
          const userData = await userApi.getMe();
          auth.setUserInfo(userData);

          if (window.handleLoginSuccessGlobal) {
            window.handleLoginSuccessGlobal({ nickname: userData.nickname, loginCount: userData.loginCount });
          }
        } catch (error) {
          console.error('로그인 처리 실패:', error);
          showLoginFailAlert.value = true;
        }
      }

      popupRef = null;
    }
  }, 1000);
};

const handleSocialLogin = debounce((provider) => {
  console.log('소셜 로그인 시작:', provider);
  const loginUrl =
    provider === 'kakao'
      ? `https://api.kdark.weareshadowpins.com/api/v1/auth/login/kakao`
      : 'https://api.kdark.weareshadowpins.com/oauth2/authorization/google';

  popupRef = window.open(loginUrl, '소셜로그인', 'width=500,height=700');

  if (!popupRef) {
    alert('팝업이 차단되었습니다. 팝업 허용을 켜주세요.');
    return;
  }

  checkPopupClosed();
}, 300);



onBeforeUnmount(() => {
  console.log('test')
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