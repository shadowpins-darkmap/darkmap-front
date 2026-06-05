<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps(['visible', 'width', 'right', 'left']);
const emit = defineEmits(['close']);

const close = () => emit('close');
</script>

<template>
  <Teleport to="body">
    <Transition name="slide_fade">
      <div v-if="props.visible" class="slide_panel_root">
        <!-- 외부 클릭 시 닫히는 투명 오버레이 -->
        <div class="slide_panel_backdrop" @click="close" />
        <div
          class="slide_panel"
          :style="{
            right: props.right || '0px',
            left: props.left || 'auto',
            width: props.width,
          }"
        >
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.slide_panel_root {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
}

.slide_panel_backdrop {
  position: absolute;
  inset: 0;
  pointer-events: all;
}

.slide_panel {
  position: absolute;
  top: 0;
  height: 100vh;
  color: #fff;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  pointer-events: all;
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
