<template>
  <div class="account_wrap">
    <button class="popup_back_button" @click="$emit('back')">
      <img
        src="@/assets/popupBack.svg"
        alt="slider close icon"
        width="36"
        height="36"
      />
    </button>
    <div class="account_profile_img">
      <img
        src="@/assets/accountProfileImg.svg"
        class="account_img"
        alt="account profile img"
        width="94"
        height="94"
      />
    </div>

    <div class="account_profile_wrap">
      <!-- 닉네임 -->
      <div>
        <label class="form_label" for="nickname">닉네임</label>
        <input
          id="nickname"
          type="text"
          class="form_input"
          placeholder="닉네임 입력"
          v-model="nickname"
        />
      </div>
      <!-- 약관 동의 -->
      <div class="terms_section">
        <p class="terms_title">서비스 법률 권한 설정</p>
        <!-- 필수 동의 항목 -->
        <div class="term_item">
          <button class="term_label" @click="openTerms('개인정보처리방침')">
            개인정보처리방침
          </button>

          <span class="term_state">업데이트 2025.7.7</span>
        </div>

        <!-- 선택 동의 항목 -->
        <div class="term_item">
          <button class="term_label" @click="openTerms('마케팅 및 광고 수신')">
            마케팅 및 광고 수신
          </button>
          <span :class="[marketing.agreed ? 'term_state' : 'term_state_off']"
            >부동의
          </span>
          <label
            class="toggle_switch"
            :class="{ 'optional-on': marketing.agreed }"
          >
            <input type="checkbox" v-model="marketing.agreed" />
            <span class="slider"></span>
          </label>
          <span :class="[marketing.agreed ? 'term_state_on' : 'term_state']"
            >동의</span
          >
        </div>
      </div>

      <!-- 계정 상태 -->
      <div class="account_status">
        <p class="terms_title">계정 상태</p>
        <button class="account_action" @click="logout">
          <img
            width="30px"
            height="30px"
            src="@/assets/accountLogout.svg"
            alt="delete"
          />
          <span>로그아웃</span>
        </button>
        <button class="account_action">
          <img
            width="30px"
            height="30px"
            src="@/assets/accountDelete.svg"
            alt="delete"
          />
          <span>탈퇴하기</span>
        </button>
      </div>

      <!-- 수정 완료 버튼 -->
      <button class="submit_btn">수정완료</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/auth';

defineProps({
  items: Object,
});
const emit = defineEmits(['back', 'open-terms-panel']);
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  emit('back');
};

// const nickname = ref(props.items.nickname);
const nickname = ref('nickname');

const marketing = ref({ agreed: true });

const openTerms = (label) => {
  if (label === '개인정보처리방침') {
    emit('open-terms-panel');
  }
  if (label === '마케팅 및 광고 수신') {
    window.open(
      'https://dune-purple-f80.notion.site/20025ce1e4e980488049ccff29c43668',
      '_blank',
      'noopener,noreferrer',
    );
  }
};
</script>

<style scoped>
/* 닉네임 인풋 */
.form_label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
  font-size: 20px;
}
.form_input {
  display: flex;
  width: 260px;
  padding: 12px 20px;
  border-radius: 20px;
  border: 2px solid #f1cfc8;
  font-size: 14px;
}
.form_input::placeholder {
  color: #c7c7cc;
}

.account_wrap {
  display: flex;
  flex-direction: row;
  margin-top: 50px;
  justify-content: space-between;
  color: #fff;
  position: relative;
}
.popup_back_button {
  position: absolute;
  top: -50px;
  left: 0px;
}

.account_profile_img {
  display: flex;
  justify-content: center;
  padding-right: 20px;
}

.account_profile_wrap {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 40px;
}

/* 닉네임 인풋 */
.form_label {
  font-weight: bold;
  font-size: 18px;
}
.form_input {
  width: 100%;
  padding: 12px;
  border-radius: 20px;
  height: 50px;
  border: 2px solid #f1cfc8;
  font-size: 14px;
  color: #333;
}

/* 약관 섹션 */
.terms_section {
  display: flex;
  flex-direction: column;
}
.terms_title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 12px;
}
.term_item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.term_label {
  font-size: 16px;
  text-decoration: underline;
  flex: 1;
  color: #fff;
  text-align: left;
}
.term_state {
  font-size: 13px;
}
.term_state_on {
  font-size: 13px;
  color: #ff99e5;
  font-weight: 500;
}
.term_state_off {
  font-size: 13px;
  color: #ababab;
  font-weight: 500;
}
/* 계정 상태 */
.account_status {
  display: flex;
  flex-direction: column;
}

.account_action {
  width: 100px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
  align-self: flex-end;
}
.account_action > span {
  font-size: 16px;
  text-decoration: underline;
  color: #fff;
  display: flex;
  padding-top: 2px;
}

/* 토글 스위치 */
.toggle_switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 15px;
}
.toggle_switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ababab;
  border-radius: 20px;
  transition: 0.4s;
}
.slider::before {
  position: absolute;
  content: '';
  height: 13px;
  width: 18px;
  left: 1px;
  bottom: 1px;
  background-color: white;
  border-radius: 13px;
  transition: 0.4s;
}
.toggle_switch input:checked + .slider {
  background-color: #ff99e5;
}
.toggle_switch input:checked + .slider::before {
  transform: translateX(15px);
}

/* 제출 버튼 */
.submit_btn {
  margin-top: 10px;
  background: black;
  color: white;
  font-weight: bold;
  padding: 14px;
  border-radius: 30px;
  border: 2px solid #f1cfc8;
  width: 138px;
  align-self: flex-end;
  font-size: 14px;
}
</style>
