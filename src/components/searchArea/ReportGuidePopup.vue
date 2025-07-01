<template>
  <div
    class="report_guide_popup_wrap"
    @click.self="
      () => {
        $emit('close');
        selected.value = null;
      }
    "
  >
    <!-- 기본 리스트 화면 -->
    <div class="report_guide_popup" v-if="selected === null">
      <button class="popup_close" @click="$emit('close')">
        <img
          src="@/assets/reportGuidePopupCloseIcon.svg"
          alt="popup close icon"
          width="24"
          height="24"
        />
      </button>
      <img
        src="@/assets/reportGuideMainImg.svg"
        class="report_guide_main_img"
        alt="report guide main img"
      />
      <strong class="report_guide_popup_title"
        >신고하고 싶은 길거리 괴롭힘이 있나요?</strong
      >
      <p class="report_guide_popup_description">
        아래의 방법을 참고해서 대응을 고려해보세요.
      </p>

      <ul class="report_guide_list">
        <li>
          <button @click="selected = 'safetyApp'">서울안심이 앱</button>
        </li>
        <li>
          <button @click="selected = 'tel1366'">여성 긴급 전화 1366</button>
        </li>
        <li>
          <button @click="selected = 'tel1388'">청소년 상담 전화 1388</button>
        </li>
        <li>
          <button @click="selected = 'supportMap'">
            여성단체 상담·의료·법률 지원처 주소록
          </button>
        </li>
        <li>
          <button @click="selected = 'onlinePolice'">
            서울경찰청 여성청소년범죄신고 (온라인)
          </button>
        </li>
      </ul>
    </div>

    <!-- 서울안심이 앱 -->
    <div class="report_guide_popup" v-if="selected === 'safetyApp'">
      <div class="guide_inner">
        <button class="popup_back_button" @click="selected = null">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup back icon"
            width="24"
            height="24"
          />
          뒤로 가기
        </button>
        <img
          src="@/assets/safetyApp1.svg"
          alt="popup safety img"
          width="204"
          height="182"
          class="top_img_safetyApp1"
        />
        <div class="top_img_wrap">
          <img
            src="@/assets/safetyApp2.svg"
            alt="popup safety img"
            width="182"
            height="56"
          />
          <img
            src="@/assets/safetyApp3.svg"
            alt="popup safety img"
            width="182"
            height="56"
          />
        </div>
        <p class="guide_info_text">
          서울시에서 제작한 귀갓길 안전 공립 서비스 무료 앱.
        </p>
        <div class="top_img_wrap">
          <img
            src="@/assets/safetyApp4.svg"
            alt="popup safety img"
            width="102"
            height="208"
          />
          <img
            src="@/assets/safetyApp5.svg"
            alt="popup safety img"
            width="102"
            height="208"
          />
          <img
            src="@/assets/safetyApp6.svg"
            alt="popup safety img"
            width="102"
            height="208"
          />
        </div>
        <p class="guide_info_text">
          긴급신고 버튼을 직접 누르거나 스마트폰을 세게 흔들면 자동으로 신고가
          실행됩니다. 안드로이드폰에서는 볼륨버튼을 세번이상 눌러도 가능. 자치구
          관제 모니터링 화면에 내 상황이 전달되고, 필요할 경우 경찰이 출동해서
          조치를 취해줍니다.
        </p>
        <button class="popup_go_to_button">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup go to icon"
            class="popup_go_to_icon"
            width="24"
            height="24"
          />
          <strong> 소개 페이지 가기 </strong>
          <span> 서울 안심이에 대해 더 궁금하다면? </span>
        </button>
      </div>
    </div>
    <!-- 여성 긴급 전화 1366-->
    <div class="report_guide_popup" v-if="selected === 'tel1366'">
      <div class="guide_inner">
        <button class="popup_back_button" @click="selected = null">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup back icon"
            width="24"
            height="24"
          />
          뒤로 가기
        </button>
        <img
          src="@/assets/tel13661.svg"
          alt="popup tel1366 img"
          width="148"
          height="154"
          class="top_img_tel1366"
        />

        <p class="guide_info_text">
          지방자치단체 직영 또는 비영리법인·민간단체 등에 위탁 운영되는
          <br />
          여성 인권 보호 긴급 24시간 핫라인
        </p>
        <strong class="guide_info_title">서비스 이용대상</strong>
        <p class="guide_info_text">
          가정폭력·성폭력·성매매·스토킹·교제폭력 등 폭력 피해자로 긴급한 구조,
          <br />
          보호 및 상담 등이 필요한 경우 이용할 수 있습니다.
        </p>
        <strong class="guide_info_title">제공 서비스</strong>
        <p class="guide_info_text">
          여성폭력 피해자에 대한 초기지원 창구로써,
          <br />상담 및 긴급피난처를 제공하며 전문 상담소, 각 지역의 정부기관,
          경찰, 병원, 법률기관과 연계하여 피해자를 지원합니다.
        </p>

        <button class="popup_go_to_button">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup go to icon"
            class="popup_go_to_icon"
            width="24"
            height="24"
          />
          <strong> 소개 페이지 가기 </strong>
          <span> 서울 안심이에 대해 더 궁금하다면? </span>
        </button>
      </div>
    </div>
    <!-- 청소년 상담 전화 1388 -->
    <div class="report_guide_popup" v-if="selected === 'tel1388'">
      <div class="guide_inner">
        <button class="popup_back_button" @click="selected = null">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup back icon"
            width="24"
            height="24"
          />
          뒤로 가기
        </button>
      </div>
    </div>
    <!-- 여성단체 상담·의료·법률 지원처 주소록 -->
    <div class="report_guide_popup" v-if="selected === 'supportMap'">
      <div class="guide_inner">
        <button class="popup_back_button" @click="selected = null">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup back icon"
            width="24"
            height="24"
          />
          뒤로 가기
        </button>
      </div>
    </div>
    <!-- 서울경찰청 여성청소년범죄신고 (온라인)-->
    <div class="report_guide_popup" v-if="selected === 'onlinePolice'">
      <div class="guide_inner">
        <button class="popup_back_button" @click="selected = null">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup back icon"
            width="24"
            height="24"
          />
          뒤로 가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const selected = ref('tel1366');

defineEmits(['close', 'select']);
</script>

<style scoped lang="scss">
.report_guide_popup_wrap {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.report_guide_popup {
  width: 558px;
  height: 754px;
  background-color: #fff;
  border-radius: 15px;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.popup_close {
  display: flex;
  align-self: flex-end;
  padding: 15px;
}
.report_guide_main_img {
  margin: 50px 0 60px 0;
}
.report_guide_popup_title {
  font-size: 20px;
  color: #000;
  padding-bottom: 20px;
}
.report_guide_popup_description {
  font-size: 14px;
  font-weight: normal;
  color: #004de8;
  padding-bottom: 30px;
}
.report_guide_list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

// selected
.top_img_wrap {
  display: flex;
  gap: 20px;
}
.top_img_safetyApp1 {
  margin: 10px 0;
}
.guide_info_text {
  color: #ffefeb;
  font-size: 14px;
  padding: 20px 10px;
  word-break: keep-all;
  text-align: center;
}
.guide_info_title {
  display: flex;
  color: #ffefeb;
  font-size: 14px;
  padding-top: 10px;
}
.report_guide_list button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  border: 1px solid #d3d3d3;
  min-width: 256px;
  color: #424142;
  font-size: 14px;
  cursor: pointer;
}

.popup_back_button {
  height: 24px;
  display: flex;
  align-items: center;
  color: #ffefeb;
  align-self: flex-start;
}
.popup_go_to_button {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 5px;
  width: 100%;
  color: #ffefeb;
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}
.popup_go_to_icon {
  display: flex;
  transform: rotate(180deg) translateY(1px);
}
.guide_inner {
  background-color: #313457;
  width: 100%;
  height: 100%;
  padding: 15px;
  border-radius: 14px;
  border: 1px solid #ffffff9b;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
</style>
