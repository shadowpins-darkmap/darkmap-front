<template>
  <div class="form_wrap">
    <BaseDropdown
      :list="categories"
      :selected="selectedCategory"
      :onSelect="handleCategorySelect"
    />
    <BaseInput
      v-model="title"
      :id="'write_title'"
      label="유형 (필수)"
      placeholder="길거리 괴롭힘의 유형을 알려주세요."
      :readonly="true"
    />
    <BaseInput
      v-model="location"
      :id="'write_location'"
      label="위치 (필수)"
      placeholder="구체적인 장소를 알 수 없다면 ‘구', ‘동’ 까지만 적으셔도 됩니다."
    />
    <BaseTextarea
      v-model="content"
      label="내용 (필수)"
      placeholder="자신이 알고있거나 직간접적으로 경험한 사건의 경위 내용을 간략히 설명해주세요."
      :id="'write_detail'"
      :height="'100px'"
    />
    <BaseInput
      v-model="image"
      type="file"
      label="이미지"
      :id="'write_image'"
      :accept="'image/png, image/jpeg, image/gif'"
      :onChange="handleImage"
    />
    <BaseInput
      v-model="url"
      :id="'write_url'"
      label="뉴스기사 URL"
      placeholder="언론에 다뤄진 적이 있다면 뉴스기사 링크를 첨부해주세요. "
    />
    <button class="submit_button" @click="submitPost" :disabled="loading">
      {{ loading ? '제출 중...' : '제보' }}
    </button>
  </div>

  <BaseAlertPopup
    v-if="showSuccessAlert"
    title="제보를 완료했습니다."
    @confirm="handleSuccessConfirm"
    confirmText="확인"
  >
    <p>
      사이트 운영진의 검토후 장소가 등록되면<br />등록하신 이메일로 알려드려요
    </p>
  </BaseAlertPopup>
  <BaseAlertPopup
    v-if="showValidationPopup"
    title="입력 확인"
    @confirm="showValidationPopup = false"
  >
    <p>유형, 위치, 내용을 모두 입력해주세요.</p>
  </BaseAlertPopup>
  <BaseAlertPopup
    v-if="showErrorPopup"
    title="제보 실패"
    @confirm="showErrorPopup = false"
  >
    <p>제보 접수에 실패했습니다. 다시 시도해주세요.</p>
  </BaseAlertPopup>
  <BaseAlertPopup
    v-if="showImageErrorPopup"
    title="이미지 크기 초과"
    @confirm="showImageErrorPopup = false"
  >
    <p>10MB 이하의 이미지만 첨부할 수 있습니다.</p>
  </BaseAlertPopup>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import BaseDropdown from '@/components/BaseDropdown.vue';
import BaseInput from '@/components/communityPopup/BaseInput.vue';
import BaseTextarea from '@/components/communityPopup/BaseTextarea.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import { boardsApi } from '@/api/boards';

const categories = ['바바리맨', '폭행', '헌팅', '미행', '그 외'];
const selectedCategory = ref(categories[0]);
const title = ref(categories[0]);
const location = ref('');
const content = ref('');
const imageFile = ref(null);
const previewUrl = ref('');
const url = ref('');
const showSuccessAlert = ref(false);
const showValidationPopup = ref(false);
const showErrorPopup = ref(false);
const showImageErrorPopup = ref(false);

const handleImage = (event) => {
  const file = event.target.files[0];
  if (file && file.size < 10 * 1024 * 1024) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  } else {
    showImageErrorPopup.value = true;
  }
};

const handleCategorySelect = (item) => {
  selectedCategory.value = item;
  title.value = item;
};

const resetForm = () => {
  selectedCategory.value = categories[0];
  title.value = categories[0];
  location.value = '';
  content.value = '';
  imageFile.value = null;
  previewUrl.value = '';
  url.value = '';
};

const handleSuccessConfirm = () => {
  showSuccessAlert.value = false;
  emit('close');
};

const emit = defineEmits(['submit', 'close']);
const loading = ref(false);

const submitPost = async () => {
  if (!selectedCategory.value || !location.value || !content.value) {
    showValidationPopup.value = true;
    return;
  }

  try {
    loading.value = true;

    const formData = new FormData();
    formData.append('reportType', selectedCategory.value);
    formData.append('reportLocation', location.value);
    formData.append('content', content.value);

    if (url.value) formData.append('newsUrl', url.value);
    if (imageFile.value) formData.append('imageFile', imageFile.value);

    await boardsApi.createIncidentReport(formData);

    emit('submit', {
      category: selectedCategory.value,
      title: title.value,
      content: content.value,
    });
    resetForm();
    showSuccessAlert.value = true;
  } catch (error) {
    console.error('제보 실패:', error);
    showErrorPopup.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form_wrap {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
}

.form_wrap > *:first-child {
  margin-bottom: 16px;
}

:deep(.BaseDropdown) {
  font-size: 15px;
}

:deep(.BaseDropdown__toggle) {
  height: 26px;
  padding: 6px 14px;
  font-size: 14px;
  border-radius: 14px;
}

:deep(.BaseDropdown__toggle::after) {
  width: 10px;
  height: 10px;
}

:deep(.BaseDropdown__menu) {
  top: 34px;
  min-width: 164px;
}

.input_title,
.input_content {
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
}

.input_content {
  height: 120px;
  resize: none;
}

.submit_button {
  background: black;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  width: 136px;
  border: 2px solid #f1cfc8;
  border-radius: 42px;
  align-self: self-end;
}
</style>
