<template>
  <div :class="['render-map', { 'render-map--mobile': isMobile }]">
    <TestMap v-if="!isMobile" />
    <ControlMobile v-if="isMobile" />
    <!-- <ControlPopup v-else /> -->
    <CommunityPopup v-if="!isMobile" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import TestMap from '@/components/TestMap.vue';
import { useDevice } from '@/composables/useDevice';

// Lazy load heavy components
const ControlMobile = defineAsyncComponent(
  () => import('@/components/ControlMobile.vue'),
);
const CommunityPopup = defineAsyncComponent(
  () => import('@/components/CommunityPopup.vue'),
);

const { isMobile } = useDevice();
</script>

<style scoped>
.render-map {
  position: fixed;
  inset: 0;
  overflow: hidden;
}
.render-map--mobile {
  overflow-y: auto;
  scrollbar-color: transparent transparent;
}
.render-map--mobile:hover {
  scrollbar-color: #ffefeb transparent;
}
.render-map--mobile::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.render-map--mobile::-webkit-scrollbar-button {
  display: none;
}
.render-map--mobile::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 6px;
}
.render-map--mobile::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 6px;
}
.render-map--mobile:hover::-webkit-scrollbar-thumb {
  background-color: #ffefeb;
}
.render-map--mobile:hover::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
