<script setup>
import { ref, onMounted, onBeforeUnmount, defineProps } from 'vue';

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: 'auto' },
  gradientColor: { type: String, default: 'rgba(0, 0, 0, 0.6)' },
});

const scrollArea = ref(null);
const showLeft = ref(false);
const showRight = ref(true);

const updateGradient = () => {
  const el = scrollArea.value;
  if (!el) return;
  showLeft.value = el.scrollLeft > 0;
  showRight.value = el.scrollWidth - el.clientWidth - el.scrollLeft > 5;
};

const handleWheel = (e) => {
  if (!scrollArea.value) return;
  e.preventDefault();
  scrollArea.value.scrollLeft += e.deltaY;
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
    <!-- Left Gradient -->
    <div
      v-if="showLeft"
      class="scroll_gradient left"
      :style="{
        background: `linear-gradient(to right, ${props.gradientColor}, transparent)`,
      }"
    ></div>

    <!-- Scrollable Content -->
    <div class="scroll_area" ref="scrollArea">
      <slot></slot>
    </div>

    <!-- Right Gradient -->
    <div
      v-if="showRight"
      class="scroll_gradient right"
      :style="{
        background: `linear-gradient(to left, ${props.gradientColor}, transparent)`,
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
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll_gradient {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 30px;
  pointer-events: none;
  z-index: 1;
}
.scroll_gradient.left {
  left: 0;
}
.scroll_gradient.right {
  right: 0;
}
/* scroll reset */
.scroll_area::-webkit-scrollbar {
  display: none;
}
</style>
