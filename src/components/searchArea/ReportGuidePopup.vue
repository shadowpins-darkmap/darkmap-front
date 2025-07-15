<template>
  <div class="report_guide_popup_wrap" @click.self="handleBackgroundClick">
    <!-- 기본 리스트 화면 -->
    <div class="report_guide_popup" v-if="selected === null">
      <button class="popup_close" @click="$emit('close')">
        <img
          src="@/assets/sliderCloseIcon.svg"
          alt="slider close icon"
          width="36"
          height="36"
        />
      </button>
      <img
        src="@/assets/reportGuideMainImg.svg"
        class="report_guide_main_img"
        width="128"
        height="128"
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
            경찰 민원 포털 신고
          </button>
        </li>
      </ul>
    </div>

    <!-- 서울안심이 앱 -->
    <div class="report_guide_popup" v-if="selected === 'safetyApp'">
      <div class="guide_inner">
        <div class="popup_top_button_wrap">
          <button class="popup_back_button" @click="selected = null">
            <img
              src="@/assets/popupBack.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
          <button class="popup_top_close" @click="$emit('close')">
            <img
              src="@/assets/sliderCloseIcon.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
        </div>
        <img
          src="@/assets/safetyApp1.svg"
          alt="popup safety img"
          width="128"
          height="128"
          class="top_img_safetyApp1"
        />
        <div class="top_img_wrap">
          <a
            href="https://play.google.com/store/apps/details?id=kr.go.seoul.ansimi.woman&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="@/assets/safetyApp2.svg"
              alt="popup safety img"
              width="182"
              height="56"
          /></a>
          <a
            href="https://apps.apple.com/kr/app/%EC%84%9C%EC%9A%B8%EC%8B%9C-%EC%95%88%EC%8B%AC%EC%9D%B4/id1204100862?platform=iphone"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="@/assets/safetyApp3.svg"
              alt="popup safety img"
              width="182"
              height="56"
            />
          </a>
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
        <!-- <button class="popup_go_to_button">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup go to icon"
            class="popup_go_to_icon"
            width="24"
            height="24"
          />
          <strong> 소개 페이지 가기 </strong>
          <span> 서울 안심이에 대해 더 궁금하다면? </span>
        </button> -->
      </div>
    </div>
    <!-- 여성 긴급 전화 1366-->
    <div class="report_guide_popup" v-if="selected === 'tel1366'">
      <div class="guide_inner">
        <div class="popup_top_button_wrap">
          <button class="popup_back_button" @click="selected = null">
            <img
              src="@/assets/popupBack.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
          <button class="popup_top_close" @click="$emit('close')">
            <img
              src="@/assets/sliderCloseIcon.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
        </div>
        <img
          src="@/assets/tel13661.svg"
          alt="popup tel1366 img"
          width="128"
          height="128"
          class="top_img_tel1366"
        />

        <a
          class="guide_top_button"
          href="https://seoul1366.or.kr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          사이트 방문하기
        </a>
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

        <!-- <button class="popup_go_to_button">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup go to icon"
            class="popup_go_to_icon"
            width="24"
            height="24"
          />
          <strong> 소개 페이지 가기 </strong>
          <span> 1366에 대해 더 궁금하다면? </span>
        </button> -->
      </div>
    </div>
    <!-- 청소년 상담 전화 1388 -->
    <div class="report_guide_popup" v-if="selected === 'tel1388'">
      <div class="guide_inner">
        <div class="popup_top_button_wrap">
          <button class="popup_back_button" @click="selected = null">
            <img
              src="@/assets/popupBack.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
          <button class="popup_top_close" @click="$emit('close')">
            <img
              src="@/assets/sliderCloseIcon.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
        </div>
        <img
          src="@/assets/tel13881.svg"
          alt="popup tel1388 img"
          width="128"
          height="128"
          class="top_img_tel1388"
        />
        <a
          class="guide_top_button"
          href="https://www.1388.go.kr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          사이트 방문하기
        </a>
        <p class="guide_info_text">
          한국청소년상담복지개발원 청소년사이버상담센터에서 운영하는
          <br />
          청소년 인권 보호 긴급 24시간 핫라인
        </p>
        <strong class="guide_info_title">서비스 이용대상</strong>
        <p class="guide_info_text">
          청소년기본법에 따른 만 9~24세 청소년과 부모 및 보호자
        </p>
        <strong class="guide_info_title">상담 내용</strong>
        <p class="guide_info_text">
          청소년기에 나타날 수 있는 다양한 고민(학업 및 진로, 친구관계,
          가족문제, 학교폭력, 성폭력 및 성매매 등의 문제, 가출 고민 등) 등에
          대해 청소년이 직접 전문상담자와 심리상담을 나눌 수 있음청소년기 자녀를
          둔 부모 및 보호자가 직접 청소년의 건강한 심리적 지도, 지원에 필요한
          내용을 전문상담자와 상담할 수 있음
        </p>

        <!-- <button class="popup_go_to_button">
          <img
            src="@/assets/reportGuideBackArrow.svg"
            alt="popup go to icon"
            class="popup_go_to_icon"
            width="24"
            height="24"
          />
          <strong> 소개 페이지 가기 </strong>
          <span> 1388에 대해 더 궁금하다면?</span>
        </button> -->
      </div>
    </div>
    <!-- 여성단체 상담·의료·법률 지원처 주소록 -->
    <div class="report_guide_popup" v-if="selected === 'supportMap'">
      <div class="guide_inner">
        <div class="popup_top_button_wrap">
          <button class="popup_back_button" @click="selected = null">
            <img
              src="@/assets/popupBack.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
          <button class="popup_top_close" @click="$emit('close')">
            <img
              src="@/assets/sliderCloseIcon.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
        </div>
        <img
          src="@/assets/supportMap.svg"
          alt="popup tel1388 img"
          width="128"
          height="128"
          class="top_img_tel1388"
        />
        <a
          class="guide_top_button"
          href="https://docs.google.com/spreadsheets/d/1sr2FJuWAyPDiXlg8oyjVtiKtyHfbQJqmSVYQ1FsqD3c/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
        >
          주소록 링크 가기
        </a>
        <p class="guide_info_text">
          셰도우 핀즈가 수집하고 업데이트하는 여성 폭력 지원처 주소록.
        </p>
        <strong class="guide_info_title mt_20">포함 범위</strong>
        <p class="guide_info_text">
          여성 / 청소년 긴급전화, 정부 운영기관, 전국 단위 여성단체/민간단체
          상담 지원처, 수사기관, 법조계
        </p>
        <strong class="guide_info_title">최종 업데이트 일</strong>
        <p class="guide_info_text">2023.10.22</p>
      </div>
    </div>
    <!-- 서울경찰청 여성청소년범죄신고 (온라인)-->
    <div class="report_guide_popup" v-if="selected === 'onlinePolice'">
      <div class="guide_inner">
        <div class="popup_top_button_wrap">
          <button class="popup_back_button" @click="selected = null">
            <img
              src="@/assets/popupBack.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
          <button class="popup_top_close" @click="$emit('close')">
            <img
              src="@/assets/sliderCloseIcon.svg"
              alt="slider close icon"
              width="36"
              height="36"
            />
          </button>
        </div>
        <img
          src="@/assets/onlinePolice.svg"
          alt="popup onlinePolice img"
          width="128"
          height="128"
          class="top_img_onlinePolice"
        />
        <a
          class="guide_top_button"
          href="https://minwon.police.go.kr/#requestMinwon/report/STT-105"
          target="_blank"
          rel="noopener noreferrer"
        >
          전자 민원 넣기
        </a>
        <p class="guide_info_text">
          서울 경찰청 홈페이지에서 여성청소년범죄 관련 전자 민원을 넣을 수 있는
          창구
        </p>
        <strong class="guide_info_title mt_20">청소년범죄 해당 범죄</strong>
        <p class="guide_info_text">가정폭력·성폭력·성추행 등</p>
        <strong class="guide_info_title">해당 부서 연락처</strong>
        <p class="guide_info_text">
          생활안전부 여성청소년과 여성보호계 부서 번호 02-700-2981
          <br />
          *위 부서 담당업무: 성·가정폭력 예방 및 피해자 보호대책 수립,
          해바라기센터 운영, 학대전담경찰관(APO) 운영
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
const emit = defineEmits(['close', 'select']);

const selected = ref(null);
const handleBackgroundClick = () => {
  emit('close');
  selected.value = null;
};
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
  background-color: #6d54ce;
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
  color: #fff;
  padding-bottom: 20px;
}
.report_guide_popup_description {
  font-size: 14px;
  font-weight: normal;
  color: #fff;
  padding-bottom: 30px;
}
.report_guide_list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.popup_top_button_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
// selected
.top_img_wrap {
  display: flex;
  gap: 20px;
}
.top_img_safetyApp1 {
  margin-top: 20px;
  margin-bottom: 30px;
}
.top_img_tel1366 {
  margin-top: 20px;
  margin-bottom: 20px;
}
.top_img_tel1388 {
  margin-top: 20px;
  margin-bottom: 20px;
}
.top_img_onlinePolice {
  margin-top: 20px;
  margin-bottom: 20px;
}
.guide_top_button {
  width: 215px;
  height: 42px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  border: 1px solid #f1cfc8;
  border-radius: 42px;
  margin-top: 20px;
}
.guide_top_goto_button {
  width: 256px;
  height: 30px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #004de8;
  color: #fff;
  border-radius: 4px;
  margin-top: 20px;
  border: 1px solid #d3d3d3;
  margin-bottom: 20px;
}
.mt_20 {
  margin-top: 20px;
}
.guide_info_text {
  color: #fff;
  font-size: 14px;
  padding: 20px 10px;
  word-break: keep-all;
  text-align: center;
}
.guide_info_title {
  display: flex;
  color: #fff;
  font-size: 14px;
  padding-top: 10px;
}
.report_guide_list button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 10px;
  border-radius: 42px;
  background-color: #b6a9e7;
  border: 1px solid #b6a9e7;
  min-width: 256px;
  color: #000;
  font-size: 14px;
  cursor: pointer;
  height: 42px;
}
.report_guide_list button:hover {
  background-color: #000;
  color: #fff;
  font-weight: bold;
}

.popup_go_to_button {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 5px;
  width: 100%;
  color: #fff;
  position: absolute;
  bottom: 10px;
  right: 10px;
  cursor: pointer;
}

.popup_go_to_button > strong {
  text-decoration: underline;
}
.popup_go_to_icon {
  display: flex;
  transform: rotate(180deg) translateY(1px);
}
.guide_inner {
  background-color: #6d54ce;
  width: 100%;
  height: 100%;
  padding: 15px;
  border-radius: 14px;
  /* border: 1px solid #ffffff9b; */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
</style>
