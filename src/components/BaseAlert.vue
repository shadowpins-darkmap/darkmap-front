<template>
  <div class="BaseAlert">
    <div class="BaseAlert__overlay"></div>
    <div class="BaseAlert__content">
      <div class="BaseAlert__message">{{ message }}</div>
      <button @click="handleConfirm" class="BaseAlert__confirm">확인</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import '@/styles/BaseAlert.scss'

defineProps({
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['confirm'])

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style scoped lang="scss">
.BaseAlert {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
  }

  &__content {
    position: relative;
    background: #6d54ce;
    margin: 0 30px;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid #ffefeb;
  }

  &__message {
    color: #ffffff;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    text-align: center;
  }

  &__confirm {
    margin-top: 24px;
    padding: 10px 46px;
    background: #ffefeb;
    color: #6d54ce;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
