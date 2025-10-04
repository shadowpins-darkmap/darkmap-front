<template>
  <BaseAlertPopup v-if="showNicknameAlert" @confirm="handleSubmit" confirmText="등록" height="357px">
    <div class="nickname-alert-container">
      <p class="nickname-alert-title">회원님을 뭐라고 부를까요?</p>
      <div class="nickname-alert-wrapper">
        <p class="nickname-alert-subtitle">닉네임 생성</p>
        <BaseInput id="nickname" v-model="localNickname" :placeholder="'닉네임을 입력해주세요.'" />
        <p class="nickname-alert-description">
          위의 이름은 자동으로 부여되는 닉네임이며, 입력창을 선택하거나 가입후에 계정설정에서 직접 수정하실 수도 있습니다.
        </p>
      </div>
    </div>
  </BaseAlertPopup>

  <BaseAlertPopup v-if="showInvalidAlert" @confirm="handleInvalidConfirm" confirmText="확인">
    <div>
      <p style="font-size: 16px; margin-bottom: 15px;">사용할 수 없는 문자가 포함되었습니다.</p>
      <div class="nickname-rules">
        <p>아래의 문자는 닉네임에 쓰실 수 없어요.</p>
        <p>1. 특수문자 및 시스템 문자</p>
        <ul>
          <li>&lt;&gt; / \ { } [ ] ( ) ; : " ' \ ~ ^`</li>
          <li>@ # $ % & * = + | ! ?</li>
          <li>공백 문자 (space, tab)</li>
          <li>이모지나 이모티콘 (😀💥 등)</li>
          <li>SQL, HTML 삽입 가능성 있는 문자열 (--, /* */, &lt;&gt;, &lt;script&gt; 등)</li>
        </ul>
        <p>2. 비속어, 욕설 및 혐오 표현</p>
        <ul>
          <li>욕설이나 저속한 말 (국문·영문 모두)</li>
          <li>인종차별, 성차별, 혐오적 표현</li>
          <li>정치·종교적 극단 표현 (예: "Hitler", "ISIS")</li>
        </ul>
        <p>3. 타인을 사칭하거나 혼동을 줄 수 있는 표현</p>
        <ul>
          <li>관리자, 운영자, 시스템 관련 용어 포함 (예: "admin", "관리자", "운영팀", "system", "master")</li>
        </ul>
      </div>
    </div>
  </BaseAlertPopup>

  <BaseAlertPopup v-if="showDuplicateAlert" @confirm="handleDuplicateConfirm" title="이미 사용 중인 닉네임입니다." confirmText="확인">
    <p>다른 닉네임을 입력해주세요.</p>
  </BaseAlertPopup>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { userApi } from '@/api/user';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import BaseInput from '../communityPopup/BaseInput.vue';

const props = defineProps({
  nickname: String
});

const emit = defineEmits(['submit', 'invalid', 'duplicate']);

const showNicknameAlert = ref(true);
const showInvalidAlert = ref(false);
const showDuplicateAlert = ref(false);
const localNickname = ref('');

watch(() => props.nickname, (newNickname) => {
  localNickname.value = newNickname;
}, { immediate: true });

const handleSubmit = async () => {
  const originalNickname = (await userApi.getMe()).nickname;

  if (localNickname.value === originalNickname) {
    showNicknameAlert.value = false;
    emit('submit', localNickname.value);
    return;
  }

  try {
    await userApi.updateNickname(localNickname.value);
    showNicknameAlert.value = false;
    emit('submit', localNickname.value);
  } catch (error) {
    if (error.response?.data?.code === 'INVALID_NICKNAME') {
      showNicknameAlert.value = false;
      showInvalidAlert.value = true;
    } else if (error.response?.data?.code === 'NICKNAME_DUPLICATE') {
      showNicknameAlert.value = false;
      showDuplicateAlert.value = true;
    }
  }
};

const handleInvalidConfirm = () => {
  showInvalidAlert.value = false;
  showNicknameAlert.value = true;
};

const handleDuplicateConfirm = () => {
  showDuplicateAlert.value = false;
  showNicknameAlert.value = true;
};
</script>

<style scoped lang="scss">
.nickname-alert {
  &-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-title {
    font-size: 22px;
    font-weight: 700;
    padding-top: 20px;
    text-align: center;
  }

  &-wrapper {
    width: 240px;
    margin-top: 35px;
    text-align: left;
  }

  &-subtitle {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  &-description {
    font-size: 12px;
    color: #f1cfc8;
    line-height: 1.4;
  }
}

.nickname-rules {
  width: 268px;
  height: 139px;
  background: #FFFFFF8C;
  overflow-y: auto;
  padding: 6px 11px;
  color: #000;
  font-size: 12px;
  margin: 34px 0;
  text-align: left;

  p,
  ul {
    text-align: left;
    margin: 8px 0;
  }

  ul {
    list-style: none;
    padding-left: 0;

    li {
      position: relative;
      padding-left: 12px;
      margin-left: 6px;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        top: 0;
        color: #000;
        font-weight: bold;
      }
    }
  }
}
</style>