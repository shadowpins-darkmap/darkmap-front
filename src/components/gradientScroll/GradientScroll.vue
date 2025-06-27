<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps, computed } from 'vue';

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: 'auto' },
  gradientColor: { type: String, default: 'rgba(0, 0, 0, 0.6)' },
  direction: { type: String, default: 'horizontal' },
});

const scrollArea = ref(null);
const showStart = ref(false);
const showEnd = ref(true);
const isHorizontal = computed(() => props.direction === 'horizontal');

const updateGradient = () => {
  const el = scrollArea.value;
  if (!el) return;
  if (isHorizontal.value) {
    showStart.value = el.scrollLeft > 0;
    showEnd.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 5;
  } else {
    showStart.value = el.scrollTop > 0;
    showEnd.value = el.scrollHeight - el.clientHeight - el.scrollTop > 5;
  }
};

const handleWheel = (e) => {
  const el = scrollArea.value;
  if (!el) return;
  e.preventDefault();

  if (isHorizontal.value) {
    el.scrollLeft += e.deltaY;
  } else {
    el.scrollTop += e.deltaY;
  }

  updateGradient();
};

onMounted(() => {
  const el = scrollArea.value;
  el?.addEventListener('scroll', updateGradient);
  el?.addEventListener('wheel', handleWheel, { passive: false });
  updateGradient();
});

onBeforeUnmount(() => {
  const el = scrollArea.value;
  el?.removeEventListener('scroll', updateGradient);
  el?.removeEventListener('wheel', handleWheel);
});
</script>

<template>
  <div
    class="gradient_scroll_container"
    :style="{ width: props.width, height: props.height }"
  >
    <!-- Start Gradient (Left or Top) -->
    <div
      v-if="showStart"
      class="scroll_gradient"
      :class="isHorizontal ? 'left' : 'top'"
      :style="{
        background: isHorizontal
          ? `linear-gradient(to right, ${props.gradientColor}, transparent)`
          : `linear-gradient(to bottom, ${props.gradientColor}, transparent)`,
      }"
    ></div>

    <!-- Scrollable Slot Content -->
    <div
      class="scroll_area"
      ref="scrollArea"
      :class="isHorizontal ? 'horizontal' : 'vertical'"
    >
      <slot></slot>
    </div>

    <!-- End Gradient (Right or Bottom) -->
    <div
      v-if="showEnd"
      class="scroll_gradient"
      :class="isHorizontal ? 'right' : 'bottom'"
      :style="{
        background: isHorizontal
          ? `linear-gradient(to left, ${props.gradientColor}, transparent)`
          : `linear-gradient(to top, ${props.gradientColor}, transparent)`,
      }"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.gradient_scroll_container {
  position: relative;
  overflow: hidden;
}
.scroll_area {
  scrollbar-width: none;
  -ms-overflow-style: none;
  &.horizontal {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  &.vertical {
    overflow-y: auto;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-break: keep-all;
    height: 100%;
  }
}

.scroll_gradient {
  position: absolute;
  pointer-events: none;
  z-index: 1;

  &.left {
    top: 0;
    bottom: 0;
    left: 0;
    width: 30px;
  }
  &.right {
    top: 0;
    bottom: 0;
    right: 0;
    width: 30px;
  }
  &.top {
    left: 0;
    right: 0;
    top: 0;
    height: 100px;
  }
  &.bottom {
    left: 0;
    right: 0;
    bottom: 0;
    height: 100px;
  }
}

/* scroll reset */
.scroll_area::-webkit-scrollbar {
  display: none;
}
</style>
