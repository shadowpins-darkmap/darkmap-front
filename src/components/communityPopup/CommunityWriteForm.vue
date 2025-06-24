<template>
  <div>
    <h3>글쓰기</h3>
    <BaseDropdown
      :list="categories"
      :selected="selectedCategory"
      :onSelect="handleCategorySelect"
    />
    <input
      type="text"
      placeholder="제목을 입력하세요"
      class="input_title"
      v-model="title"
    />
    <textarea
      placeholder="내용을 입력하세요"
      class="input_content"
      v-model="content"
    ></textarea>
    <button class="submit_button" @click="submitPost">올리기</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import BaseDropdown from '@/components/BaseDropdown.vue';

const categories = ['제보', '기억', '고민', '질문', '미분류'];
const selectedCategory = ref(categories[0]);
const title = ref('');
const content = ref('');

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
  margin-top: 16px;
  background: black;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
