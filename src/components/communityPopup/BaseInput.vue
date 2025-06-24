<template>
  <div class="form_group">
    <label class="form_label" :for="id">{{ label }}</label>
    <input
      class="form_input"
      :id="id"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
    />
  </div>
</template>

<script setup>
import { defineProps, defineModel } from 'vue';

defineProps({
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
});

const model = defineModel(); // v-model 지원
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
</style>
