<template>
  <div class="account_wrap">
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
      <label class="form_label" for="nickname">닉네임</label>
      <input
        id="nickname"
        type="text"
        class="form_input"
        placeholder="닉네임 입력"
        v-model="nickname"
      />

      <!-- 약관 동의 -->
      <div class="terms_section">
        <p class="terms_title">서비스 법률 권한 설정</p>
        <div class="term_item" v-for="item in items" :key="item.id">
          <span class="term_label">{{ item.label }}</span>
          <label class="toggle_switch">
            <input type="checkbox" v-model="item.agreed" />
            <span class="slider"></span>
          </label>
          <span class="term_state">{{ item.agreed ? '동의' : '철회' }}</span>
        </div>
      </div>

      <!-- 계정 상태 -->
      <div class="account_status">
        <p class="terms_title">계정 상태</p>
        <div class="account_action">
          <span>🔌</span>
          <button>로그아웃</button>
        </div>
        <div class="account_action">
          <span>📤</span>
          <button>탈퇴하기</button>
        </div>
      </div>

      <!-- 수정 완료 버튼 -->
      <button class="submit_btn">수정완료</button>
    </div>

    {{ props.items }}
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  items: Object,
});
const nickname = ref(props.items.nickname);
</script>

<style scoped>
.account_wrap {
  display: flex;
  flex-direction: row;
  margin-top: 50px;
}

/* 닉네임 인풋 */
.form_label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
  font-size: 20px;
}
.form_input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #f1cfc8;
  font-size: 14px;
}
.form_input::placeholder {
  color: #c7c7cc;
}

.account_wrap {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  color: #fff;
}

.account_profile_img {
  display: flex;
  justify-content: center;
}

.account_profile_wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 닉네임 인풋 */
.form_label {
  font-weight: bold;
  font-size: 20px;
}
.form_input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #f1cfc8;
  font-size: 14px;
  color: #333;
}

/* 약관 섹션 */
.terms_section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.terms_title {
  font-weight: bold;
  font-size: 16px;
}
.term_item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.term_label {
  flex: 1;
}
.term_state {
  font-size: 14px;
}

/* 계정 상태 */
.account_status {
  margin-top: 20px;
}
.account_action {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 5px 0;
}

/* 토글 스위치 */
.toggle_switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
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
  background-color: #ccc;
  border-radius: 20px;
  transition: 0.4s;
}
.slider::before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}
.toggle_switch input:checked + .slider {
  background-color: #ff77d6;
}
.toggle_switch input:checked + .slider::before {
  transform: translateX(20px);
}

/* 제출 버튼 */
.submit_btn {
  margin-top: 30px;
  background: black;
  color: white;
  font-weight: bold;
  padding: 14px;
  border-radius: 30px;
  border: 2px solid #fff;
}
</style>
