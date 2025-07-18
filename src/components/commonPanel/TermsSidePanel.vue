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
    <strong class="slider_title ponit_color_green">사이트 이용약관</strong>

    <!-- 셀렉트 박스 -->
    <BaseDropdown
      :list="dropdownList"
      :selected="selectedVersion"
      :onSelect="onSelectVersion"
    />

    <!-- 하위 타이틀 -->
    <strong class="slider_title_sub">Ver {{ selectedVersion }}</strong>
    <div class="slider_contents_wrap scroll_area">
      <p class="slider_contents">
        용어로도 출판이나 연출을 지칭하는 입숨을 표준 이런 들어가는 디자인
        결과물에 시각적 입숨은 그래픽 텍스트로, 텍스트로, 입숨은 분야에서
        실제적인 보여줄 무언가를 표준 로렘 무언가를 때로 입숨은 채우기 입숨은
        사용할 시각 이용된다.
      </p>
      <p class="slider_contents">
        프로젝트 채우기 사용하는 차지하는 프로젝트 보여줄 내용이 입숨을
        타이포그래피, 지칭하는 프로젝트 사용할 프로젝트 출판이나 채워지기 디자인
        보여줄 프로젝트 내용이 차지하는 시각적 사용할 연출을 타이포그래피, 때
      </p>
    </div>
  </div>
</template>

<script setup>
// emits: close, openDetail
import BaseDropdown from '@/components/BaseDropdown.vue';
import { ref } from 'vue';

const dropdownList = [
  '2025.5.25.',
  '2025.4.20.',
  '2025.3.15.',
  '2025.2.05.',
  '2025.1.01.',
];

const selectedVersion = ref(dropdownList[0]);

const onSelectVersion = (version) => {
  selectedVersion.value = version;
};
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

.ponit_color_green {
  display: flex;
  padding-top: 40px;
  padding-bottom: 20px;
  font-weight: bold;
  font-size: 24px;
  color: #00ffc2;
}
.slider_contents {
  padding-bottom: 25px;
  font-size: 16px;
  color: #fff;
  font-weight: normal;
}
.slider_contents_wrap {
  overflow-y: auto;
  max-height: 600px;
}
.slider_title_sub {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  padding-bottom: 20px;
  padding-top: 20px;
}
.slider_list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.slider_list_button {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.slider_list_button > span {
  padding-top: 4px;
}
.slider_list_icon {
  margin-left: 5px;
}
</style>
