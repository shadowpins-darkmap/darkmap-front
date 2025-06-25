<template>
  <div class="base_alert_backdrop">
    <div class="base_alert_popup">
      <p class="popup_title">{{ title }}</p>
      <p class="popup_description"><slot></slot></p>
      <button class="confirm_button" @click="$emit('confirm')">확인</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
defineProps({
  title: {
    type: String,
    required: true,
  },
});
defineEmits(['confirm']);
</script>

<style scoped>
.base_alert_backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.base_alert_popup {
  background: #6d54ce;
  border-radius: 16px;
  border: 2px solid #f1cfc8;
  padding: 30px;
  text-align: center;
  color: #fff;
  min-width: 300px;
}

.popup_title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
}

.popup_description {
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 24px;
}

.confirm_button {
  background: #000;
  color: #fff;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  min-width: 120px;
  border: none;
  cursor: pointer;
}
</style>
