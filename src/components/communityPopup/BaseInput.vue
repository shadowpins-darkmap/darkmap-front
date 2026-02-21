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
      <span class="file_name" :class="{ is_placeholder: !fileName }">{{
        fileName || '10MB 이하의 png, jpeg, gif 만 첨부 가능합니다.'
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
      :readonly="readonly"
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
  readonly: {
    type: Boolean,
    default: false,
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
.form_input:read-only {
  background-color: #faf1ef;
  color: #6a6a6a;
}
.form_input::placeholder {
  color: #c7c7cc;
}

.custom_file_input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background-color: #fff;
  color: #000;
  padding: 10px;
  border-radius: 10px;
  border: 2px solid #f1cfc8;
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}
.custom_file_input:hover {
  border-color: #f1cfc8;
  background-color: #fbf8ff;
  box-shadow: 0 0 0 2px rgba(185, 152, 199, 0.15);
}
.hidden_file_input {
  display: none;
}
.file_label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 70px;
  height: 30px;
  padding: 0 1px;
  border-radius: 15px;
  background-color: #faf1ef;
  border: 1px solid #f1cfc8;
  color: #766e7a;
  font-size: 12px;
  font-weight: 700;
}
.file_name {
  font-size: 14px;
  flex: 1;
  min-width: 0;
  color: #4b4b4b;
  opacity: 1;
  margin-left: 3px;
}
.file_name.is_placeholder {
  color: #c7c7cc;
}
.preview_image {
  max-width: 50px;
  max-height: 50px;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
