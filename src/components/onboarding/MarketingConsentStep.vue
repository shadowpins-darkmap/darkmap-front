<template>
  <BaseAlertPopup v-if="showAlert" @confirm="handleAgree" @cancel="handleSkip" confirmText="동의하기" cancelText="나중에"
    :showTwoButtons="true">
    <div class="marketing-container">
      <p class="marketing-title">마케팅 및 광고 활용 약관에 동의하시면<br />
        맞춤 혜택과 이벤트 소식을 보내드려요
      </p>
      <div class="marketing-scroll">
        <p class="marketing-content">
          ‘개인정보 보호법’ 제 22조제4항(동의를 받는 방법)에 근거하여, K-다크맵 투어에서 제공하는 이벤트 및 서비스 안내 등 광고성 정보를 받으시려면 하단의 내용을 숙지후 이 약관에 동의하여 주시기
          바랍니다.

          1. 수집 목적
          첫째, 서비스 프로모션 이벤트 정보 제공
          둘째, 공지사항 및 서비스 법률 변경 안내 전달
          2. 수집 항목
          이메일, 휴대 전화번호, 카카오톡 계정 ID
          3. 보유 기간
          첫번째 목적의 수집 항목은 이벤트 종료시 즉시 파기, 두번째 목적의 수집항목은 회원탈퇴 시 파기

          ⚠️귀하는 이 약관에 동의하지 않을 권리가 있습니다. 모든 서비스 이용자는 회원가입시에 동의 여부를 선택할 수 있으며 이후 우측 첫번째 패널에 ‘계정설정’에서 결정사항을 변경할 수 있습니다. 그
          외 서비스 이용자의 개인정보 처리에 대해서는 [사이트 개인정보처리방침](https://www.notion.so/20025ce1e4e980689f25e1db1373fd9c?pvs=21) 문서를
          참고해주십시오.
        </p>
      </div>
    </div>
  </BaseAlertPopup>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { userApi } from '@/api/user';
import BaseAlertPopup from '@/components/BaseAlert.vue';

const emit = defineEmits(['agree', 'skip']);

const showAlert = ref(true);

const handleAgree = async () => {
  try {
    await userApi.updateMarketingAgreement();
    showAlert.value = false;
    emit('agree');
  } catch (error) {
    console.error('마케팅 동의 실패:', error);
    showAlert.value = false;
    emit('skip');
  }
};

const handleSkip = () => {
  showAlert.value = false;
  emit('skip');
};
</script>

<style scoped lang="scss">
.marketing-container {
  width: 268x;
  padding-top: 14px;
}

.marketing-title {
  width: 100%;
  font-size: 16px;
  line-height: 1.3;
  padding: 6px 0;
}

.marketing-scroll {
  width: 268px;
  height: 139px;
  background: #FFFFFF8C;
  overflow-y: auto;
  padding: 6px 11px;
  color: #000;
  font-size: 12px;
  margin: 34px 0;
  text-align: left;
}

.marketing-content {
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
}
</style>