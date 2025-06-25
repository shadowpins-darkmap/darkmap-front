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
      label="유형 (필수)"
      placeholder="길거리 괴롭힘의 유형을 알려주세요."
    />
    <BaseInput
      v-model="location"
      :id="write_location"
      label="위치 (필수)"
      placeholder="구체적인 장소를 알 수 없다면 ‘구', ‘동’ 까지만 적으셔도 됩니다."
    />
    <BaseTextarea
      v-model="content"
      label="내용 (필수)"
      placeholder="자신이 알고있거나 직간접적으로 경험한 사건의 경위 내용을 간략히 설명해주세요."
      :id="write_contents"
      :height="'100px'"
    />
    <BaseInput
      v-model="image"
      :id="write_image"
      label="이미지"
      placeholder="10mb 이하의 png, jpeg, gif 만  첨부 가능합니다."
    />
    <BaseInput
      v-model="url"
      :id="write_url"
      label="뉴스기사 URL"
      placeholder="언론에 다뤄진 적이 있다면 뉴스기사 링크를 첨부해주세요. "
    />
    <button class="submit_button" @click="submitPost">제보</button>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import BaseDropdown from '@/components/BaseDropdown.vue';
import BaseInput from '@/components/communityPopup/BaseInput.vue';
import BaseTextarea from '@/components/communityPopup/BaseTextarea.vue';

const categories = ['제보'];
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
