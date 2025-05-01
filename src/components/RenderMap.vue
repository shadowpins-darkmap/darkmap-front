<template>
  <div class="render-map">
    <TestMap />
    <BaseAlert
      v-if="isMobile && showAlert"
      message="K다크맵 투어 1차 오픈 버전은 데스크탑에 최적화되어 있습니다. 모바일에서는 제한적인 사용만 가능함을 양해 부탁드립니다"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TestMap from '@/components/TestMap.vue'
import BaseAlert from '@/components/BaseAlert.vue'
import { useDevice } from '@/composables/useDevice'

const { isMobile } = useDevice()
const showAlert = ref(true)

const handleConfirm = () => {
  showAlert.value = false
}
</script>

<style scoped>
.render-map {
  position: relative;
}

/* 오버레이가 BaseAlert에서 필요하다면 BaseAlert.vue에서 다음 스타일을 추가해도 좋음:
.BaseAlert {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
*/
</style>
