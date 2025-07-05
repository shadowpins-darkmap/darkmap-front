<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps(['visible', 'width', 'right', 'left']);
const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<template>
  <Transition name="slide_fade">
    <div
      v-if="props.visible"
      class="slide_panel"
      @click.self="close"
      :style="{
        right: props.right || '0px',
        left: props.left || 'auto',
        width: props.width,
      }"
    >
      <slot></slot>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.slide_panel {
  position: fixed;
  top: 0;
  height: 100vh;
  color: #fff;
  z-index: 999;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
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
