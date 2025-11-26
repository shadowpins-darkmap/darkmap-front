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
</template>

<script setup>
import { defineEmits } from 'vue';
import { debounce } from 'lodash';
import { getOAuthLoginUrl, OAUTH_PROVIDERS } from '@/utils/oauth';

const emit = defineEmits(['close']);

const handleSocialLogin = debounce((provider) => {
  console.log('🚀 소셜 로그인 시작:', provider);

  const loginUrl = getOAuthLoginUrl(provider);

  console.log('📍 생성된 URL:', loginUrl);

  if (!loginUrl) {
    alert('로그인 URL을 찾을 수 없습니다.');
    return;
  }

  // sessionStorage 설정
  sessionStorage.setItem('oauth_in_progress', 'true');
  sessionStorage.setItem('oauth_provider', provider);
  sessionStorage.setItem('oauth_start_time', Date.now().toString());

  console.log('✅ SessionStorage 설정 완료');

  // 팝업 닫기
  emit('close');

  // 약간의 딜레이 후 리다이렉트
  setTimeout(() => {
    console.log('🔄 페이지 이동:', loginUrl);
    window.location.href = loginUrl;
  }, 150);
}, 300);
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
