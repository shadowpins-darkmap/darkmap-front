<template>
  <div class="base_alert_backdrop">
    <div class="base_alert_popup" :style="{ height: props.height }">
      <p v-if="title" class="popup_title">{{ title }}</p>
      <p class="popup_description">
        <slot></slot>
      </p>
      <div v-if="showTwoButtons" class="button_group">
        <button class="cancel_button" @click="$emit('cancel')">
          {{ cancelText }}
        </button>
        <button class="confirm_button" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
      <button v-else class="confirm_button" @click="$emit('confirm')">
        {{ confirmText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  showTwoButtons: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: '확인',
  },
  cancelText: {
    type: String,
    default: '닫기',
  },
  height: {
    type: String,
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

.cancel_button {
  background: #b6a9e7;
  color: #000;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  min-width: 120px;
  border: none;
  cursor: pointer;
}

.button_group {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
