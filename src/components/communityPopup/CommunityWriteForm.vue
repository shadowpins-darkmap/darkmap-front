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
      :id="write_image"
      label="이미지"
      placeholder="10mb 이하의 png, jpeg, gif 만  첨부 가능합니다."
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
const image = ref('');

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
