<template>
  <div class="form_group">
    <label class="form_label" :for="id">{{ label }}</label>
    <div class="form_textarea_wrap" :style="{ height: height }">
      <!-- <GradientScroll
        :height="'300px'"
        direction="vertical"
        gradient-color="rgba(255,255,255,0.6)"
      > -->
      <div class="scroll_inner">
        <textarea
          class="form_textarea"
          :id="id"
          :placeholder="placeholder"
          v-model="model"
          :style="{ minHeight: `calc(${height} - 26px)` }"
        ></textarea>
      </div>
      <!-- </GradientScroll> -->
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineModel } from 'vue';
// import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';

defineProps({
  label: String,
  placeholder: String,
  height: String,
});

const model = defineModel();
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
.form_textarea_wrap {
  width: 100%;
  border-radius: 10px;
  border: 2px solid #f1cfc8;
  background-color: #fff;
}
.scroll_inner {
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
}
.form_textarea {
  width: 100%;
  resize: none;
  border: none;
  font-size: 14px;
  background: transparent;
  color: #000;
}
.form_textarea::placeholder {
  color: #c7c7cc;
}
</style>
