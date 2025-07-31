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
    <strong class="slider_title ponit_color"
      >길거리 괴롭힘이란게 뭔가요?</strong
    >

    <div class="slider_contents_wrap">
      <GradientScroll
        :width="'100%'"
        :height="'100%'"
        gradient-color="rgba(0,0,0,1)"
        direction="vertical"
      >
        <p class="slider_contents">
          길거리 괴롭힘(Street Harassment)이란, 대중교통, 학교 등 공공장소에서
          발생하는 합의되지 않은 신체적 접촉, 추행, 쫓아오기, 위협, 촬영, 폭언,
          성기노출, 언어적 성희롱 등을 포함한 행동으로, 이러한 행위들은 종종
          성적 의도를 가지고 있지만, 종교, 인종, 성 정체성, 장애, 사회적 계급
          등과 관련된 혐오 발언과 트랜스포비아, 동성애 혐오를 비방하는 내용도
          포함될 수 있습니다.
        </p>
        <p class="slider_contents">
          한국성폭력상담소의 길거리 괴롭힘 실태조사(2016)에서 분석한 사례에서는
          추행이 90건으로 73%를 차지했으며 가해자는 성인 남성이 대다수였다고
          합니다. 24개 국가, 71개 도시에서의 길거리괴롭힘 실태를 조사한 미국
          비영리단체
          <a
            class="slider_contents_link"
            :href="'https://righttobe.org/'"
            target="_blank"
            >Right To Be</a
          >에 따르면 미국 여성 절반과 남성 4명 중 1명 꼴로 어린 시절부터 여러
          차례 길거리 괴롭힘을 경험한 것으로 나타났고 이들은 발생 장소를
          회피하고 일상생활에 지장을 받는 경향이 있는 것으로 보고되었습니다.
        </p>
        <p class="slider_contents">
          길거리 괴롭힘의 극단적인 결과로는 여성 특정 살해인 ‘페미사이드’로
          이어질 수 있으며 언론도 주로 이러한 유형의 사건들이 다루지만, 여성
          일반 집단은 일상적으로 매우 다변적인 유형의 폭력들을 마주하고
          있습니다. K-다크맵 투어는 여성의 이 보이지 않는 경험을 구체화하기 위한
          프로젝트입니다.
        </p>
        <!-- <p class="slider_contents">
        출처:
        <a :href="'https://righttobe.org/'" target="_blank"
          >https://femiwiki.com/w/길거리_괴롭힘</a
        >
      </p> -->
      </GradientScroll>
    </div>

    <strong class="slider_title_sub">길거리 괴롭힘의 유형</strong>
    <ol class="slider_list">
      <li v-for="(title, i) in titles" :key="i">
        <button class="slider_list_button" @click="$emit('openDetail', title)">
          <span>{{ i + 1 }}. {{ title }}</span>
          <img
            src="@/assets/sliderGoDetailIcon.svg"
            class="slider_list_icon"
            alt="slider arrow icon"
            width="16"
            height="16"
          />
        </button>
      </li>
    </ol>
  </div>
</template>

<script setup>
// emits: close, openDetail
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
const titles = ['바바리맨', '폭행', '헌팅', '미행', '그 외'];
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
.ponit_color {
  color: #8270cb;
}
.slider_contents {
  padding-bottom: 25px;
  font-size: 16px;
  color: #fff;
  font-weight: normal;
}
.slider_contents_link {
  font-size: 16px;
  color: #fff;
  font-weight: normal;
  text-decoration: underline;
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
  padding-top: 40px;
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
