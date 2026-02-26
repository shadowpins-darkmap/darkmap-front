<template>
  <div class="form_wrap">
    <BaseDropdown
      :list="categories"
      :selected="selectedCategory"
      :onSelect="handleCategorySelect"
    />
    <BaseInput
      v-model="title"
      :id="write_title"
      label="제목"
      placeholder="제목을 입력하세요"
    />
    <BaseTextarea
      v-model="content"
      label="내용"
      placeholder="내용을 입력하세요"
      :id="write_contents"
      :height="'300px'"
    />
    <BaseInput
      v-model="image"
      type="file"
      label="이미지"
      :id="'write_image'"
      :accept="'image/png, image/jpeg, image/gif'"
      :onChange="handleImage"
    />
    <button class="submit_button" @click="submitPost">글쓰기</button>
  </div>

  <BaseAlertPopup
    v-if="showSuccessAlert"
    @confirm="handleSuccessConfirm"
    title="글쓰기를 완료했습니다."
    confirmText="확인"
  >
    <p>
      감사합니다! K-다크맵 투어는 시민들의 기억과<br />이야기를 지키는 안전한
      공간이 되겠습니다.
    </p>
  </BaseAlertPopup>
  <BaseAlertPopup
    v-if="showErrorAlert"
    @confirm="showErrorAlert = false"
    title="게시글 작성 실패"
    confirmText="확인"
  >
    <p>게시글 작성에 실패했습니다.<br />다시 시도해주세요.</p>
  </BaseAlertPopup>
  <BaseAlertPopup
    v-if="showValidationAlert"
    @confirm="showValidationAlert = false"
    title="입력 확인"
    confirmText="확인"
  >
    <p>제목과 내용을 입력해주세요.</p>
  </BaseAlertPopup>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import BaseDropdown from '@/components/BaseDropdown.vue';
import BaseInput from '@/components/communityPopup/BaseInput.vue';
import BaseTextarea from '@/components/communityPopup/BaseTextarea.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import { boardsApi } from '@/api/boards';
import { useAuthStore } from '@/store/useAuthStore';

const auth = useAuthStore();
const categories = ['기억', '고민', '질문', '미분류'];
const selectedCategory = ref(categories[0]);
const title = ref('');
const content = ref('');
const imageFile = ref(null);
const previewUrl = ref('');
const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);
const showValidationAlert = ref(false);

const handleImage = (event) => {
  const file = event.target.files[0];
  if (file && file.size < 10 * 1024 * 1024) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  } else {
    alert('10MB 이하의 이미지만 첨부할 수 있습니다.');
  }
};

const handleCategorySelect = (item) => {
  selectedCategory.value = item;
};

const handleSuccessConfirm = () => {
  showSuccessAlert.value = false;
  emit('close');
};
const emit = defineEmits(['submit', 'close']);
const submitPost = async () => {
  try {
    if (!title.value.trim() || !content.value.trim()) {
      showValidationAlert.value = true;
      return;
    }

    const formData = new FormData();
    formData.append('category', selectedCategory.value);
    formData.append('title', title.value);
    formData.append('content', content.value);
    if (imageFile.value) {
      formData.append('imageFile', imageFile.value);
    }

    const response = await boardsApi.createBoard(formData);

    await auth.getMyBoards();

    title.value = '';
    content.value = '';
    imageFile.value = null;
    previewUrl.value = '';
    selectedCategory.value = categories[0];

    showSuccessAlert.value = true;
    emit('submit', response.data);
  } catch (error) {
    console.error('게시글 작성 실패:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    });
    showErrorAlert.value = true;
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
