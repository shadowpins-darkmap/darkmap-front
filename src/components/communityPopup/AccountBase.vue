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

    <div class="account_profile_wrap">
      <div class="profile_header">
        <div class="account_profile_img">
          <img
            src="@/assets/accountProfileImg.svg"
            class="account_img"
            alt="account profile img"
            width="94"
            height="94"
          />
        </div>
        <div class="nickname_field">
          <label class="form_label" for="nickname">닉네임</label>
          <input
            id="nickname"
            type="text"
            class="form_input"
            placeholder="닉네임 입력"
            v-model="nickname"
          />
        </div>
      </div>

      <!-- 약관 동의 -->
      <div class="terms_section">
        <p class="terms_title">서비스 법률 권한 설정</p>
        <div class="term_item">
          <button class="term_label" @click="openTerms('개인정보처리방침')">
            개인정보처리방침
          </button>
          <span class="term_update term_control">업데이트 2025.7.7</span>
        </div>

        <div class="term_item">
          <button class="term_label" @click="openTerms('마케팅광고수신')">
            마케팅광고수신
          </button>
          <div class="term_control">
            <span class="term_state">철회</span>
            <label class="toggle_switch">
              <input
                type="checkbox"
                :checked="marketing.agreed"
                @change="handleMarketingToggle"
              />
              <span class="slider"></span>
            </label>
            <span :class="marketing.agreed ? 'term_state_on' : 'term_state'"
              >동의</span
            >
          </div>
        </div>
      </div>

      <!-- 계정 상태 -->
      <div class="account_status">
        <p class="terms_title">계정 상태</p>
        <button class="account_action" @click="onLogout">
          <img
            width="24"
            height="24"
            src="@/assets/accountLogout.svg"
            alt="logout"
          />
          <span>로그아웃</span>
        </button>
        <button class="account_action" @click="openWithdrawModal">
          <img
            width="24"
            height="24"
            src="@/assets/accountDelete.svg"
            alt="withdraw"
          />
          <span>탈퇴하기</span>
        </button>
      </div>

      <!-- 수정 완료 버튼 -->
      <button class="submit_btn" @click="handleSubmit">수정완료</button>
    </div>
  </div>

  <BaseAlertPopup
    v-if="showErrorAlert"
    @confirm="showErrorAlert = false"
    title="프로필 수정 실패"
    confirmText="확인"
  >
    <p>{{ errorMessage }}</p>
  </BaseAlertPopup>

  <BaseAlertPopup
    v-if="showSuccessAlert"
    @confirm="showSuccessAlert = false"
    title="프로필 수정 완료"
    confirmText="확인"
  >
    <p>프로필 수정을 완료했습니다.</p>
  </BaseAlertPopup>

  <BaseAlertPopup
    v-if="showLoadErrorAlert"
    @confirm="handleLoadErrorConfirm"
    title="프로필 로드 실패"
    confirmText="확인"
  >
    <p>프로필 불러오기에 실패했습니다.</p>
  </BaseAlertPopup>

  <WithdrawConfirmModal
    :visible="showWithdrawModal"
    :loading="withdrawLoading"
    @cancel="handleWithdrawCancel"
    @confirm="handleWithdrawConfirm"
  />

  <BaseAlertPopup
    v-if="showWithdrawSuccessAlert"
    title="탈퇴 완료"
    confirmText="확인"
    @confirm="handleWithdrawSuccessConfirm"
  >
    <p>탈퇴처리가 완료되었습니다.</p>
  </BaseAlertPopup>

  <BaseAlertPopup
    v-if="showWithdrawErrorAlert"
    title="탈퇴 실패"
    confirmText="확인"
    @confirm="showWithdrawErrorAlert = false"
  >
    <p>{{ withdrawErrorMessage }}</p>
  </BaseAlertPopup>
</template>

<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue';
import { useAuthStore } from '@/store/useAuthStore';
import { userApi } from '@/api/user';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import WithdrawConfirmModal from '@/components/communityPopup/WithdrawConfirmModal.vue';

defineProps({
  items: Object,
});
const emit = defineEmits(['back', 'open-terms-panel']);
const auth = useAuthStore();

const onLogout = async () => {
  await auth.logout();
  emit('back');
};

const nickname = ref('');
const originalNickname = ref('');
const normalizeMarketingValue = (value) =>
  value === null || value === undefined ? false : Boolean(value);
const marketing = ref({
  agreed: normalizeMarketingValue(auth.marketingAgreed),
});
const originalMarketing = ref({
  agreed: normalizeMarketingValue(auth.marketingAgreed),
});

onMounted(async () => {
  try {
    const userData = await userApi.getMe();
    nickname.value = userData.nickname;
    originalNickname.value = userData.nickname;
    const agreed = normalizeMarketingValue(userData.marketingAgreed);
    marketing.value.agreed = agreed;
    originalMarketing.value.agreed = agreed;
    auth.setUserInfo(userData);
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);
    showLoadErrorAlert.value = true;
  }
});

const showErrorAlert = ref(false);
const errorMessage = ref('');
const showSuccessAlert = ref(false);
const showLoadErrorAlert = ref(false);
const showWithdrawModal = ref(false);
const withdrawLoading = ref(false);
const showWithdrawSuccessAlert = ref(false);
const showWithdrawErrorAlert = ref(false);
const withdrawErrorMessage = ref('');

const handleLoadErrorConfirm = () => {
  showLoadErrorAlert.value = false;
  emit('back');
};

const handleSubmit = async () => {
  const promises = [];

  if (nickname.value !== originalNickname.value) {
    promises.push(userApi.updateNickname(nickname.value));
  }

  if (marketing.value.agreed !== originalMarketing.value.agreed) {
    promises.push(userApi.updateMarketingAgreement(marketing.value.agreed));
  }

  if (promises.length === 0) {
    return;
  }

  try {
    await Promise.all(promises);
    if (nickname.value !== originalNickname.value) {
      auth.nickname = nickname.value;
    }
    if (marketing.value.agreed !== auth.marketingAgreed) {
      auth.marketingAgreed = marketing.value.agreed;
    }

    originalNickname.value = nickname.value;
    originalMarketing.value.agreed = marketing.value.agreed;
    showSuccessAlert.value = true;
  } catch (error) {
    console.error('수정 실패:', error);
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.errorMessage ||
      error?.message ||
      '프로필 수정 중 오류가 발생했습니다.';
    errorMessage.value = message;
    showErrorAlert.value = true;
  }
};

const handleMarketingToggle = (event) => {
  marketing.value.agreed = event.target.checked;
};

const openTerms = (label) => {
  if (label === '개인정보처리방침') {
    emit('open-terms-panel');
  }
  if (label === '마케팅광고수신') {
    window.open(
      'https://dune-purple-f80.notion.site/20025ce1e4e980488049ccff29c43668',
      '_blank',
      'noopener,noreferrer',
    );
  }
};

const openWithdrawModal = () => {
  showWithdrawModal.value = true;
};

const handleWithdrawCancel = () => {
  if (withdrawLoading.value) return;
  showWithdrawModal.value = false;
};

const handleWithdrawConfirm = async () => {
  if (withdrawLoading.value) {
    return;
  }

  withdrawLoading.value = true;
  try {
    await auth.withdraw();
    showWithdrawModal.value = false;
    showWithdrawSuccessAlert.value = true;
  } catch (error) {
    const message = '회원 탈퇴 처리 중 문제가 발생했습니다.';
    withdrawErrorMessage.value = message;
    showWithdrawErrorAlert.value = true;
  } finally {
    withdrawLoading.value = false;
  }
};

const handleWithdrawSuccessConfirm = () => {
  showWithdrawSuccessAlert.value = false;
  emit('back');
};
</script>

<style scoped>
.account_wrap {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  color: #fff;
  position: relative;
  min-height: 520px;
}

.popup_back_button {
  align-self: flex-start;
  margin-bottom: 20px;
}

.account_profile_img {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile_header {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nickname_field {
  flex: 1;
}

.account_profile_wrap {
  display: flex;
  flex-direction: column;
  gap: 34px;
  width: 100%;
  padding: 0 8px;
}

.form_label {
  display: block;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}

.form_input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 28px;
  height: 44px;
  border: 2px solid #f1cfc8;
  font-size: 16px;
  line-height: 1.2;
  color: #333;
}

.form_input::placeholder {
  color: #c7c7cc;
}

.terms_section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.terms_title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 4px;
}

.term_item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.term_label {
  font-size: 16px;
  letter-spacing: 0.4px;
  text-decoration: underline;
  flex: 1;
  color: #fff;
  text-align: left;
}

.term_state {
  font-size: 13px;
  color: #d6d6d6;
}

.term_update {
  font-size: 13px;
  color: #fff;
  justify-content: flex-end;
}

.term_control {
  width: 124px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.term_state_on {
  font-size: 13px;
  color: #ff99e5;
  font-weight: 500;
}

.term_state_off {
  font-size: 13px;
  color: #f4f4f4;
  font-weight: 500;
}

.account_status {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account_action {
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
}

.account_action > span {
  font-size: 16px;
  text-decoration: underline;
  color: #fff;
}

.toggle_switch {
  position: relative;
  display: inline-block;
  width: 34px;
  height: 16px;
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
  transition: 0.2s;
}

.slider::before {
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s;
}

.toggle_switch input:checked + .slider {
  background-color: #ff99e5;
}

.toggle_switch input:checked + .slider::before {
  transform: translateX(18px);
}

.toggle_switch.readonly {
  pointer-events: none;
  opacity: 0.85;
}

.submit_btn {
  margin-top: auto;
  background: black;
  color: white;
  font-weight: bold;
  padding: 14px 22px;
  border-radius: 999px;
  border: 2px solid #f1cfc8;
  width: 148px;
  align-self: center;
  font-size: 16px;
}

.withdraw_modal {
  text-align: left;
  color: #fff;
}
</style>
