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
const handleSocialLogin = (provider) => {
  const loginUrl =
    provider === 'kakao'
      ? 'https://api.kdark.weareshadowpins.com/api/v1/auth/login/kakao'
      : 'https://api.kdark.weareshadowpins.com/oauth2/authorization/google';

  window.open(loginUrl, '소셜로그인', 'width=500,height=700');

  const receiveMessage = async (event) => {
    const { accessToken, refreshToken } = event.data;
    if (!accessToken) return;

    console.log('receiveMessage✅ accessToken:', accessToken);
    console.log('receiveMessage✅ refreshToken:', refreshToken);

    // 토큰 저장
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    window.removeEventListener('message', receiveMessage);
  };

  window.addEventListener('message', receiveMessage);
};
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
