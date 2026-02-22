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
          <ol class="withdraw_policy_list">
            <li>
              K-다크맵투어의 모든 회원은 “셰도우 핀즈(이하 회사)”에 언제든지
              탈퇴를 요청할 수 있습니다.
            </li>
            <li>탈퇴신청에 대한 처리는 “회사”가 즉시 이행합니다.</li>
            <li>
              “회사”는 이용자가 본 약관 및 “회사”가 서비스의 운영을 위하여
              정하는 이용 수칙을 위반하거나 서비스의 정상적인 운영을 방해하거나
              다음 각 호에 해당하는 경우, “회원”에 대한 위반사항 게시 일시정지,
              영구이용정지 등으로 서비스 이용을 제한할 수 있습니다.
              <ul class="withdraw_sub_list">
                <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                <li>
                  “서비스”를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에
                  반하는 행위를 하는 경우
                </li>
                <li>
                  K-다크맵투어의 “커뮤니티 가이드”를 반복적으로 위반하는 어뷰징
                  행위를 해서 5회 초과되는 제지 및 경고 조치를 경우
                </li>
              </ul>
            </li>
            <li>
              “회사”는 제2항에도 불구하고, 주민등록법을 위반한 명의도용 및
              결제도용, 저작권법 및 컴퓨터프로그램보호법을 위반한 불법프로그램의
              제공 및 운영방해, 정보통신망법을 위반한 불법통신 및 해킹,
              악성프로그램의 배포, 접속권한 초과행위 등과 같이 관련법을 위반한
              경우에는 즉시 영구이용정지를 하거나 이용계약을 해지할 수 있습니다.
            </li>
            <li>
              “회사”가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이
              경우 회원에게 이를 통지하고, 회원등록 말소 전에 14일의 기간을
              정하여 소명할 기회를 부여합니다.
            </li>
            <li>
              “회원”이 일시정지가 풀려 재가입이 가능해진 후 다시 한번 커뮤니티
              가이드 위반행동이 5회 초과 달성되면 영구이용정지 조치가
              이뤄집니다.
            </li>
            <li>
              이후 계정이 정지되어 로그인을 할 수 없고 14일동안 이의제기,
              추가문의, 소명을 통해 계정 재생성을 회원은 시도할 수 있습니다.
              14일동안 아무 연락이 없으면 자동 말소됩니다. 자동말소된 이후의
              재가입은 6개월동안 할 수 없습니다.
            </li>
            <li>
              “회사”가 이용자 기록을 말소하는 경우 일주일내로 “회원”이 등록한
              정보 일반(소셜로그인 계정정보)의 모든 데이터는 삭제됩니다. 다만,
              다른 이용자의 정상적 서비스 이용을 위하여 필요한 범위 내의 데이터,
              법령상 “회사”의 보관의무가 있는 데이터, “회원”이 작성한 커뮤니티의
              “게시물” 과 “댓글”, 제보한 “다크플레이스"의 위치정보는 삭제되지
              않습니다. 이는 직접 탈퇴한 회원의 경우에도 동일하게 적용됩니다.
            </li>
            <li>
              “게시물” 등의 삭제를 원하는 이용자가 개별적으로 요청하는 경우,
              “회사”는 삭제를 위한 조치를 합니다. 다만, 해당 “게시물” 등이
              제3자에 의하여 스크랩 또는 다른 공유 기능으로 게시되거나, 이용자가
              제3자의 게시물에 댓글 등 게시물을 작성한 경우에는 해당 게시물 및
              댓글은 삭제되지 않을 수 있으므로 이용계약 해지 이전에 삭제하여야
              하며, 일부 서비스의 특성 및 성질에 따라 게시물의 삭제가 불가능할
              수 있습니다. 삭제신청은 “회사”의 대표메일
              (kdark.report@gmail.com)로 진행할 수 있습니다.
            </li>
            <li>
              탈퇴한 회원의 프로필 이미지는 K-다크맵투어에서 제공하는 디폴트
              이미지가 노출됩니다.
            </li>
            <li>탈퇴한 회원의 닉네임은 “알수 없음”으로 노출됩니다.</li>
            <li>
              다른 이용자들이 탈퇴한 회원의 글에 상호 작용(추천, 댓글)을 시도시,
              다이얼로그 팝업으로 “탈퇴한 회원의 컨텐츠입니다!”라는 메시지가
              노출됩니다.
            </li>
            <li>
              탈퇴한 회원은 이후 일주일동안 재가입에 있어 제한을 받습니다.
            </li>
            <li>
              본 조에 따른 이용제한 제재를 받은 이용자가 이의를 제기하고자 할
              경우 “회사”의 대표메일(kdark.report@gmail.com)로 문의할 수
              있습니다.
            </li>
          </ol>
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
  padding-left: 20px;
}

.withdraw_policy_list > li {
  list-style: decimal;
  margin-bottom: 12px;
  word-break: keep-all;
}

.withdraw_policy_list li:last-child {
  margin-bottom: 0;
}

.withdraw_sub_list {
  list-style: disc; /* bullet point */
  padding-left: 20px;
  margin-top: 8px;
}

.withdraw_sub_list li {
  list-style: disc;
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
