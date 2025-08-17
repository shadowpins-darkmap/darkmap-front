<template>
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
      <button class="yellow_button" @click="handleSocialLogin('kakao')">
        <img
          width="20"
          height="18"
          src="@/assets/kakaoIcon.svg"
          alt="kakao icon"
          class="kakao_icon"
        />
        카카오로 계속하기
      </button>
      <button class="black_button" @click="handleSocialLogin('google')">
        Google 계정으로 계속하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';

const auth = useAuthStore();

const TRUSTED_ORIGINS = [
  'https://darkmap-pi.vercel.app', // 리다이렉트 페이지가 열리는 프론트 도메인
  'http://localhost:8080', // 로컬에서 테스트 시
];
let popupRef = null;
let isBound = false;

const handleSocialLogin = (provider) => {
  const loginUrl =
    provider === 'kakao'
      ? `https://api.kdark.weareshadowpins.com/api/v1/auth/login/kakao`
      : 'https://api.kdark.weareshadowpins.com/oauth2/authorization/google';

  popupRef = window.open(loginUrl, '소셜로그인', 'width=500,height=700');

  if (!popupRef) {
    alert('팝업이 차단되었습니다. 팝업 허용을 켜주세요.');
    return;
  }

  const receiveMessage = async (event) => {
    // 1) 오리진 체크
    if (!TRUSTED_ORIGINS.includes(event.origin)) return;
    console.log('event.data: ', event.data);
    // 2) 해당 팝업에서 온 메시지인지 체크
    if (event.source !== popupRef) return;
    if ((event.data || {}).type !== 'SOCIAL_LOGIN_RESULT') return;

    const { success, accessToken } = event.data;
    // TODO : 데이터 받은 뒤 엑세스 토큰으로 api
    if (!success || !accessToken) return;
    // 3) 토큰 저장
    // ✅ 전역 로그인 처리 (localStorage 저장 포함)
    auth.loginWithTokens(accessToken);
    await auth.fetchAll(); // me + profile 로드

    // 4) 정리
    window.removeEventListener('message', receiveMessage);
    isBound = false;
  };
  if (!isBound) {
    window.addEventListener('message', receiveMessage);
    isBound = true;
  }
};

onBeforeUnmount(() => {
  // 안전 정리
  // receiveMessage가 클로저라면 remove는 위에서 이미 처리됨
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
