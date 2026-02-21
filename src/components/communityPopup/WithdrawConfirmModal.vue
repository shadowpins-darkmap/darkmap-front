<template>
  <BaseAlertPopup
    v-if="visible"
    title="정말로 탈퇴하시겠어요?"
    confirmText="탈퇴"
    cancelText="취소"
    :width="'360px'"
    :showTwoButtons="true"
    :confirmDisabled="isConfirmDisabled"
    @cancel="handleCancel"
    @confirm="handleConfirm"
  >
    <div class="withdraw_modal">
      <p class="withdraw_warning">
        한번 탈퇴하면 향후 재가입 등에 있어 제약을 받습니다. 정책을 먼저 숙지 후
        신중히 진행해주세요.
      </p>
      <div class="withdraw_scroll">
        <div class="withdraw_content">
          <p class="withdraw_content_title">회원탈퇴 및 이용제한</p>
          <ul class="withdraw_policy_list">
            <li>
              K-다크맵투어의 모든 회원은 “셰도우 핀즈(이하 회사)”에 언제든지
              탈퇴를 요청할 수 있으며, 탈퇴 신청은 회사가 즉시 처리합니다.
            </li>
            <li>
              이용약관 및 서비스 운영 수칙 위반, 허위 정보 등록, 불법 행위(해킹,
              악성프로그램 배포, 명의/결제 도용 등) 시 서비스 이용이 제한되거나
              즉시 영구정지 및 이용계약 해지가 될 수 있습니다.
            </li>
            <li>
              회원자격 상실 시 회원등록이 말소되며, 통지 후 소명 기회가
              부여됩니다. 탈퇴 후 일반 계정 정보는 일주일 내 삭제되지만, 법령상
              보관 데이터와 커뮤니티 게시물·댓글·제보 위치정보 등 일부 데이터는
              삭제되지 않을 수 있습니다.
            </li>
            <li>
              게시물 삭제를 원할 경우 별도 요청할 수 있으나, 제3자 공유/스크랩
              또는 서비스 특성에 따라 일부 게시물은 삭제가 제한될 수 있습니다.
              삭제 문의는 대표메일(weareshadowpins@gmail.com)로 접수할 수
              있습니다.
            </li>
            <li>
              탈퇴 시 프로필은 기본 이미지, 닉네임은 “알수 없음”으로 표시됩니다.
              탈퇴 회원의 글에 상호작용을 시도하면 안내 메시지가 노출되며, 탈퇴
              후 일주일 동안 재가입이 제한됩니다. 이용제한 관련 이의는
              대표메일로 문의할 수 있습니다.
            </li>
          </ul>
        </div>
      </div>
      <button type="button" class="withdraw_checkbox" @click="toggleAgreement">
        <img
          v-if="agreementChecked"
          class="withdraw_checkbox_icon"
          :src="checkboxIcon"
          alt="체크됨"
        />
        <img
          v-else
          class="withdraw_checkbox_icon"
          :src="uncheckedIcon"
          alt="체크 안 됨"
        />
        <span>내용을 확인했습니다.</span>
      </button>
    </div>
  </BaseAlertPopup>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits } from 'vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import checkboxIcon from '@/assets/checkbox.svg';
import uncheckedIcon from '@/assets/unchecked.svg';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['confirm', 'cancel']);

const agreementChecked = ref(false);

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      agreementChecked.value = false;
    }
  },
);

const isConfirmDisabled = computed(
  () => !agreementChecked.value || props.loading,
);

const toggleAgreement = () => {
  if (props.loading) return;
  agreementChecked.value = !agreementChecked.value;
};

const handleCancel = () => {
  if (props.loading) return;
  emit('cancel');
};

const handleConfirm = () => {
  if (isConfirmDisabled.value) return;
  emit('confirm');
};
</script>

<style scoped>
.withdraw_modal {
  text-align: left;
  color: #fff;
}

.withdraw_warning {
  font-size: 15px;
  text-align: center;
  line-height: 1.55;
  margin-bottom: 20px;
  word-break: keep-all;
}

.withdraw_scroll {
  width: 100%;
  max-height: 240px;
  background: rgba(255, 255, 255, 0.55);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 18px;
  overflow-y: auto;
  color: #000;
}

.withdraw_content {
  font-size: 13px;
  line-height: 1.7;
}

.withdraw_content_title {
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 14px;
}

.withdraw_policy_list {
  margin: 0;
  padding-left: 5px;
}

.withdraw_policy_list li {
  margin-bottom: 10px;
  word-break: keep-all;
}

.withdraw_policy_list li:last-child {
  margin-bottom: 0;
}

.withdraw_checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-top: 4px;
  background: transparent;
  border: none;
  color: #fff;
  padding: 0;
  cursor: pointer;
}

.withdraw_checkbox_icon {
  width: 20px;
  height: 20px;
}
</style>
