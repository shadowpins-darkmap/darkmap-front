<template>
  <div class="slider_wrap">
    <button class="slider_colse_button" @click="$emit('close')">
      <img
        src="@/assets/sliderCloseIcon.svg"
        alt="slider close icon"
        width="36"
        height="36"
      />
    </button>
    <strong class="community__hot_title">🔥 지금 가장 뜨거운 글이에요!</strong>
    <!-- 게시글 슬라이더 -->
    <div class="community__card_wrap">
      <div class="community__card">
        <CarouselWrap :green="true" :items-to-show="1.66" :gap="0" />
      </div>
    </div>
  </div>
</template>

<script setup>
// emits: close, openDetail
import CarouselWrap from '@/components/carousel/CarouselWrap.vue';
</script>

<style scoped lang="scss">
/* 사이드 슬라이더 */
.slider_wrap {
  background-color: #000;
  padding: 40px 25px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.slider_colse_button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.slider_title {
  font-weight: bold;
  font-size: 32px;
  display: flex;
  padding-top: 40px;
  padding-bottom: 60px;
}

.community__hot_title {
  font-size: 24px;
  font-weight: bold;
  color: #a190df;
  display: flex;
  padding-top: 20px;
}
.community__card_wrap {
  display: flex;
  transform: translateX(8px);
  position: relative;
}
.community__card_wrap::before {
  content: '';
  display: flex;
  width: 25px;
  height: 172px;
  background-color: #000;
  position: absolute;
  left: -33px;
  top: 14px;
  z-index: 1;
}
.community__card {
  width: calc(100% + 120px);
  transform: translateX(-104px);
}
</style>
