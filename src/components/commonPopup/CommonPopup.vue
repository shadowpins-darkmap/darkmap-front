<!-- components/common/BasePopup.vue -->
<template>
  <Transition name="fade">
    <div v-if="visible" class="popup_overlay" @click.self="close">
      <div class="popup_content">
        <button class="close_button" @click="close">
          <img
            src="@/assets/popupCloseIcon.svg"
            alt="popup close icon"
            width="36"
            height="36"
          />
        </button>
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
defineProps({
  visible: Boolean,
});
const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<style scoped lang="scss">
.popup_overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup_content {
  position: relative;
  background: #6d54ce;
  border-radius: 20px;
  padding: 25px;
  width: 436px;
  max-width: 90vw;
  border: 2px solid #f1cfc8;
}
.close_button {
  position: absolute;
  top: 20px;
  right: 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
