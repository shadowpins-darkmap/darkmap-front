<template>
  <BaseAlertPopup v-if="showAlert" @confirm="handleAgree" @cancel="handleSkip" confirmText="동의하기" cancelText="나중에"
    :showTwoButtons="true">
    <div class="marketing-container">
      <p class="marketing-title">마케팅 및 광고 활용 약관에 동의하시면<br />
        맞춤 혜택과 이벤트 소식을 보내드려요
      </p>
      <div class="marketing-scroll">
        <p class="marketing-content">
          [개인정보 보호법] 제22조제4항(동의를 받는 방법)에 [개인정보 보호법] 제22조제4항(동의를 받는 방법)에 [개인정보 보호법] 제22조제4항(동의를 받는 방법)에 [개인정보 보호법]
          제22조제4항(동의를 받는 방법)에 [개인정보 보호법] 제22조제4항(동의를 받는 방법)에 [개인정보 보호법] 제22조제4항(동의를 받는 방법)에
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
    await userApi.toggleMarketingAgreement();
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