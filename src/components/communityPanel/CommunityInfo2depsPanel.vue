<template>
  <div class="slider_wrap slider_2deps">
    <button class="slider_colse_button" @click="$emit('close')">
      <img
        src="@/assets/slider2depsCloseIcon.svg"
        alt="slider 2deps close icon"
        width="36"
        height="36"
      />
    </button>

    <strong class="slider_title">{{ detailType }}</strong>
    <div class="slider_contents_wrap scroll_area">
      <p class="slider_contents">
        용어로도 출판이나 연출을 지칭하는 입숨을 표준 이런 들어가는 디자인
        결과물에 시각적 입숨은 그래픽 텍스트로, 텍스트로, 입숨은 분야에서
        실제적인 보여줄 무언가를 표준 로렘 무언가를 때로 입숨은 채우기 입숨은
        사용할 시각 이용된다.
      </p>
      <p class="slider_contents">
        {{ getDetailContent(detailType) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
// emits: close
defineProps({
  detailType: {
    type: String,
    required: true,
  },
});

const getDetailContent = (type) => {
  switch (type) {
    case '바바리맨':
      return '바바리맨은 길거리에서 외설적 행동을 하는 행위입니다...';
    case '헌팅':
      return '헌팅은 원치 않는 접근이나 연락 시도를 포함할 수 있습니다...';
    // ...
    default:
      return '내용이 없습니다.';
  }
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
.slider_2deps {
  background-color: #404040;
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
.ponit_color {
  color: #8270cb;
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
