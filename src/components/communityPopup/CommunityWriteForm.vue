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
    <div v-if="isEditMode && existingImageUrl" class="edit_image_tools">
      <img :src="existingImageUrl" alt="existing image" class="existing_image" />
      <label class="delete_image_toggle">
        <input v-model="deleteImage" type="checkbox" />
        기존 이미지 삭제
      </label>
      <p class="edit_image_hint">
        새 이미지를 선택하면 교체됩니다.
      </p>
    </div>
    <button class="submit_button" @click="submitPost">
      {{ submitButtonLabel }}
    </button>
  </div>

  <BaseAlertPopup
    v-if="showSuccessAlert"
    @confirm="handleSuccessConfirm"
    :title="successTitle"
    confirmText="확인"
  >
    <p>
      <template v-if="isEditMode">
        게시글 수정이 완료되었습니다.
      </template>
      <template v-else>
        감사합니다! K-다크맵 투어는 시민들의 기억과<br />이야기를 지키는 안전한
        공간이 되겠습니다.
      </template>
    </p>
  </BaseAlertPopup>
  <BaseAlertPopup
    v-if="showErrorAlert"
    @confirm="showErrorAlert = false"
    :title="errorTitle"
    confirmText="확인"
  >
    <p>
      {{ errorMessageLine1 }}<br />
      다시 시도해주세요.
    </p>
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
import { ref, defineEmits, defineProps, watch, computed } from 'vue';
import BaseDropdown from '@/components/BaseDropdown.vue';
import BaseInput from '@/components/communityPopup/BaseInput.vue';
import BaseTextarea from '@/components/communityPopup/BaseTextarea.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import { boardsApi } from '@/api/boards';
import { useAuthStore } from '@/store/useAuthStore';

const props = defineProps({
  mode: {
    type: String,
    default: 'create',
  },
  initialPost: {
    type: Object,
    default: null,
  },
  boardId: {
    type: [Number, String],
    default: null,
  },
});

const auth = useAuthStore();
const baseCategories = ['기억', '고민', '질문', '미분류'];
const categories = ref([...baseCategories]);
const selectedCategory = ref(categories.value[0]);
const title = ref('');
const content = ref('');
const imageFile = ref(null);
const previewUrl = ref('');
const existingImageUrl = ref('');
const deleteImage = ref(false);
const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);
const showValidationAlert = ref(false);
const emit = defineEmits(['submit', 'close']);

const handleImage = (event) => {
  const file = event.target.files[0];
  if (file && file.size < 10 * 1024 * 1024) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
    if (isEditMode.value && existingImageUrl.value) {
      deleteImage.value = true;
    }
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

const isEditMode = computed(() => props.mode === 'edit');
const submitButtonLabel = computed(() =>
  isEditMode.value ? '수정하기' : '글쓰기',
);
const successTitle = computed(() =>
  isEditMode.value ? '수정을 완료했습니다.' : '글쓰기를 완료했습니다.',
);
const errorTitle = computed(() =>
  isEditMode.value ? '게시글 수정 실패' : '게시글 작성 실패',
);
const errorMessageLine1 = computed(() =>
  isEditMode.value ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.',
);

const resolveBoardId = () =>
  props.boardId ??
  props.initialPost?.boardId ??
  props.initialPost?.id ??
  props.initialPost?.board?.boardId;

const ALLOWED_CATEGORY_VALUES = new Set([
  '공지',
  '제보',
  '기억',
  '고민',
  '질문',
  '미분류',
]);

const LEGACY_TO_ALLOWED = {
  기억: '기억',
  고민: '고민',
  질문: '질문',
  미분류: '미분류',
  공지: '공지',
  제보: '제보',
  기술: '미분류',
  자유: '고민',
  리뷰: '기억',
  MEMORY: '기억',
  memory: '기억',
  WORRY: '고민',
  worry: '고민',
  ASK: '질문',
  ask: '질문',
  ETC: '미분류',
  etc: '미분류',
  GENERAL: '미분류',
  general: '미분류',
  NOTICE: '공지',
  notice: '공지',
  QNA: '질문',
  qna: '질문',
  TECH: '미분류',
  tech: '미분류',
  FREE: '고민',
  free: '고민',
  REVIEW: '기억',
  review: '기억',
  INCIDENTREPORT: '제보',
  incidentreport: '제보',
};

const ALLOWED_TO_DISPLAY = {
  공지: '공지',
  제보: '제보',
  기억: '기억',
  고민: '고민',
  질문: '질문',
  미분류: '미분류',
};

const normalizeCategoryValue = (raw) => {
  if (!raw) return null;
  const normalized = LEGACY_TO_ALLOWED[raw] || raw;
  if (ALLOWED_CATEGORY_VALUES.has(normalized)) {
    return normalized;
  }
  return null;
};

const toDisplayCategory = (raw) => {
  if (!raw) return baseCategories[0];
  const normalized = normalizeCategoryValue(raw);
  if (normalized && ALLOWED_TO_DISPLAY[normalized]) {
    return ALLOWED_TO_DISPLAY[normalized];
  }
  if (typeof raw === 'string' && baseCategories.includes(raw)) {
    return raw;
  }
  return baseCategories[0];
};

const applyInitialPost = (post) => {
  if (!post) return;
  const nextCategory = toDisplayCategory(post.category);
  if (!categories.value.includes(nextCategory)) {
    categories.value = [nextCategory, ...baseCategories];
  }
  selectedCategory.value = nextCategory;
  title.value = post.title || '';
  content.value = post.content || '';
  imageFile.value = null;
  previewUrl.value = '';
  existingImageUrl.value = post.imageUrl || '';
  deleteImage.value = false;
};

watch(
  () => props.initialPost,
  (next) => {
    if (isEditMode.value && next) {
      applyInitialPost(next);
    }
  },
  { immediate: true },
);

const submitPost = async () => {
  try {
    if (!title.value.trim() || !content.value.trim()) {
      showValidationAlert.value = true;
      return;
    }

    const formData = new FormData();
    const normalizedCategory = normalizeCategoryValue(selectedCategory.value);
    if (normalizedCategory) {
      formData.append('category', normalizedCategory);
    }
    formData.append('title', title.value);
    formData.append('content', content.value);
    if (imageFile.value) {
      formData.append(
        isEditMode.value ? 'newImageFile' : 'imageFile',
        imageFile.value,
      );
    }
    if (isEditMode.value && deleteImage.value) {
      formData.append('deleteImage', 'true');
    }

    const targetBoardId = resolveBoardId();
    if (isEditMode.value && !targetBoardId) {
      showErrorAlert.value = true;
      return;
    }

    const response = isEditMode.value
      ? await boardsApi.updateBoard(targetBoardId, formData)
      : await boardsApi.createBoard(formData);

    await auth.getMyBoards();

    if (!isEditMode.value) {
      title.value = '';
      content.value = '';
      imageFile.value = null;
      previewUrl.value = '';
      selectedCategory.value = categories.value[0];
    }

    showSuccessAlert.value = true;
    emit('submit', response.data);
  } catch (error) {
    console.error(isEditMode.value ? '게시글 수정 실패:' : '게시글 작성 실패:', {
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

.edit_image_tools {
  margin-top: 8px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #fff;
  font-size: 12px;
}

.existing_image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #f1cfc8;
}

.delete_image_toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.edit_image_hint {
  color: #cfc7ff;
  margin: 0;
}
</style>
