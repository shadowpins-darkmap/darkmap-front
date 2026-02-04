<template>
  <div class="render-map">
    <TestMap v-if="!isMobile" />
    <ControlMobile v-if="isMobile" />
    <!-- <ControlPopup v-else /> -->
    <CommunityPopup />
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
</style>
