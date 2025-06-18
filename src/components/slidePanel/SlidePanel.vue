<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps(['visible']);
const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<template>
  <Transition name="slide_fade">
    <div v-if="props.visible" class="slide_panel" @click.self="close">
      <div class="slide_panel__content">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.slide_panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 510px;
  background-color: #000;
  color: #fff;
  z-index: 999;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 30px 24px;
}

.slide_fade_enter_active,
.slide_fade_leave_active {
  transition: transform 0.3s ease;
}
.slide_fade_enter_from,
.slide_fade_leave_to {
  transform: translateX(100%);
}
</style>
