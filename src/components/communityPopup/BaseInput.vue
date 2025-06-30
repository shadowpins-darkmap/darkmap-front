<template>
  <div class="form_group">
    <label class="form_label" v-if="label" :for="id">{{ label }}</label>

    <!-- 파일 업로드 UI (type === 'file') -->
    <label v-if="type === 'file'" class="custom_file_input ellipsis__1">
      <input
        type="file"
        class="hidden_file_input"
        :id="id"
        :accept="accept"
        @change="handleChange"
      />
      <span class="file_label">파일 선택</span>
      <span class="file_name">{{
        fileName || '10mb 이하의 png, jpeg, gif 만 첨부 가능합니다.'
      }}</span>
    </label>
    <!-- 기본 인풋 (text, number 등) -->
    <input
      v-else
      class="form_input"
      :type="type"
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />

    <!-- 이미지 미리보기 -->
    <img
      v-if="type === 'file' && previewUrl"
      :src="previewUrl"
      alt="preview"
      class="preview_image"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  modelValue: String,
  accept: {
    type: String,
    default: '', // "image/*", etc.
  },
  onChange: Function,
});

const emit = defineEmits(['update:modelValue']);

const previewUrl = ref('');
const fileName = ref('');

const handleChange = (event) => {
  if (props.onChange) {
    props.onChange(event);
  }

  const file = event.target.files?.[0];
  if (file) {
    fileName.value = file.name;
    if (file.type.startsWith('image/')) {
      previewUrl.value = URL.createObjectURL(file);
    }
  }
};
</script>

<style scoped>
.form_group {
  margin-bottom: 16px;
}
.form_label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
  font-size: 20px;
}
.form_input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #f1cfc8;
  font-size: 14px;
}
.form_input::placeholder {
  color: #c7c7cc;
}

.custom_file_input {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fff;
  color: #000;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid #f1cfc8;
  font-size: 14px;
  cursor: pointer;
}
.hidden_file_input {
  display: none;
}
.file_label {
  display: none;
}
.file_name {
  font-size: 14px;
  opacity: 0.9;
}
.preview_image {
  max-width: 50px;
  max-height: 50px;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
