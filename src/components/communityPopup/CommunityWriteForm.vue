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
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import BaseDropdown from '@/components/BaseDropdown.vue';
import BaseInput from '@/components/communityPopup/BaseInput.vue';
import BaseTextarea from '@/components/communityPopup/BaseTextarea.vue';

const categories = ['기억', '고민', '질문', '미분류'];
const selectedCategory = ref(categories[0]);
const title = ref('');
const content = ref('');
const imageFile = ref(null);
const previewUrl = ref('');

const handleImage = (event) => {
  const file = event.target.files[0];
  if (file && file.size < 10 * 1024 * 1024) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  } else {
    alert('10mb 이하의 이미지만 첨부할 수 있습니다.');
  }
};

const handleCategorySelect = (item) => {
  selectedCategory.value = item;
};
const emit = defineEmits(['submit']);
const submitPost = () => {
  emit('submit', {
    category: selectedCategory.value,
    title: title.value,
    content: content.value,
  });
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
