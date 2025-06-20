<template>
  <div class="BaseCommunity">
    <section class="BaseCommunity__popup">
      <!-- 아코디언 타이틀 클릭시 토글 -->
      <div class="accordion__header" @click="isMyPageOpen = !isMyPageOpen">
        <img
          src="@/assets/arrowCirlcleButton.svg"
          class="accordion__toggle"
          :class="{ open: isMyPageOpen }"
          alt="accordion toggle icon"
          width="36"
          height="36"
        />
      </div>
      <!-- 상단 고정 말풍선 인삿말 -->
      <div class="BaseCommunity__greeting">
        <div class="BaseCommunity__avatar">
          <img src="@/assets/eyesBody.svg" alt="avatar body" />
          <img
            v-show="currentBubbleIndex === 0"
            class="BaseCommunity__avatar_eyes"
            src="@/assets/eyesOn.svg"
            alt="avatar eyes"
          />
          <img
            v-show="currentBubbleIndex === 1"
            class="BaseCommunity__avatar_eyes off"
            src="@/assets/eyesOff.svg"
            alt="avatar eyes"
          />
        </div>
        <p class="BaseCommunity__bubble">
          <span class="BaseCommunity__bubble_text">
            <span v-show="currentBubbleIndex === 0">
              <span v-if="auth.isLoggedIn">{{ auth.user?.nickname }}님 </span>
              안녕하세요!<br />
              오늘 하루 길거리에서 무슨 일 없으셨나요?
            </span>
            <span v-show="currentBubbleIndex === 1" class="next_bubble_text">
              잠깐! 모두가 지켜야할 커뮤니티 가이드를 읽으셨나요?
              <a
                href="https://TODO_link.com"
                target="_blank"
                class="next_bubble_text link"
                >전문 보러가기</a
              >
            </span>
          </span>
        </p>
      </div>

      <!-- 아코디언 본문 -->
      <div class="content_text" v-show="isMyPageOpen">
        <!-- 로그인 상태일 때 -->
        <div class="BaseCommunity__contents" v-if="auth.isLoggedIn">
          <div class="BaseCommunity__button_box">
            <button class="BaseCommunity__black_button width_fix">
              광장에 얘기하러 가기
              <img
                src="@/assets/slideCardArrow.svg"
                class="button_arrow_icon"
                alt="button arrow icon"
                width="14"
                height="14"
              />
            </button>
            <button class="BaseCommunity__black_button width_fix">
              길거리 괴롭힘 제보하러가기
              <img
                src="@/assets/slideCardArrow.svg"
                class="button_arrow_icon"
                alt="button arrow icon"
                width="14"
                height="14"
              />
            </button>
          </div>
          <strong class="BaseCommunity__hot_title margin_15">
            ⚡️ {{ auth.user?.nickname }}님을 위한 브리핑
            <button class="BaseCommunity__setting">
              <img
                src="@/assets/settingButtonIcon.svg"
                class="my_list_icon"
                alt="setting icon"
                width="20"
                height="20"
              />
              계정설정
            </button>
          </strong>
          <ul class="icon_list_wrap">
            <li class="icon_list">
              <img
                src="@/assets/iconListComment.svg"
                class="my_list_icon"
                alt="my list icon"
                width="16"
                height="16"
              />
              <span>새 댓글</span>
              <span class="point_color">{{ auth.user?.commentCount }}</span>
            </li>
            <li class="icon_list">
              <img
                src="@/assets/iconListLike.svg"
                class="my_list_icon"
                alt="my list icon"
                width="16"
                height="16"
              />
              <span>새 좋아요</span>
              <span class="point_color">{{ auth.user?.commentCount }}</span>
            </li>
            <li class="icon_list">
              <img
                src="@/assets/iconListMarker.svg"
                class="my_list_icon"
                alt="my list icon"
                width="16"
                height="16"
              />
              <span>다크플레이스 등록</span>
              <span class="point_color">{{ auth.user?.commentCount }}</span>
            </li>
          </ul>
        </div>
        <!-- 로그인 전 상태일 때-->
        <div v-else>
          <p class="BaseCommunity__hot_title">
            🔥 지금 가장 뜨거운 글이에요!
            <button class="BaseCommunity__more">전체보기</button>
          </p>
          <!-- 게시글 카드 -->
          <div class="BaseCommunity__card">
            <CarouselWrap />
          </div>

          <!-- 로그인 유도 영역 -->
          <div class="BaseCommunity__button_box">
            <p class="BaseCommunity__title">
              오늘 처음 방문하셨나요? 가입 이후에 광장의 모든 글을 보실 수
              있어요.
            </p>
            <button class="BaseCommunity__black_button">회원가입</button>
            <button
              class="BaseCommunity__login_button"
              @click="handleTestLogin"
            >
              기존 회원 로그인
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 다크맵 투어 일지 (고정) -->
    <section class="BaseCommunity__popup">
      <!-- 아코디언 타이틀 클릭시 토글 -->
      <div class="accordion__header" @click="isTourOpen = !isTourOpen">
        <strong class="accordion__title">K-다크맵 투어 일지</strong>
        <img
          src="@/assets/arrowCirlcleButton.svg"
          class="accordion__toggle"
          :class="{ open: isTourOpen }"
          alt="accordion toggle icon"
          width="36"
          height="36"
        />
      </div>
      <!-- 아코디언 본문 -->
      <div class="content_text" v-show="isTourOpen">
        <p class="content_text_title">
          현재까지 <span class="highlight">123</span> 명의 회원이 자신의 길거리
          괴롭힘 경험담을 <br />
          <span class="highlight">12344</span> 개 지역 항목에 공유해주셨습니다.
          기억에 감사드립니다.
        </p>
        <div class="tour__links">
          <button class="tour_link_button">
            <span>저도 길거리 괴롭힘을 당한 적이 있는 것 같아요 </span>
            <img
              src="@/assets/arrowCirlcleButtonRight.svg"
              class="tour__right__button"
              alt="본문 바로가기 아코디언 버튼"
              width="12"
              height="12"
            />
          </button>
          <button class="tour_link_button">
            <span>다른 사람들의 괴롭힘 경험담 이야기를 듣고 싶어요</span>
            <img
              src="@/assets/arrowCirlcleButtonRight.svg"
              class="tour__right__button"
              alt="본문 바로가기 아코디언 버튼"
              width="12"
              height="12"
            />
          </button>
          <button class="tour_link_button" @click="isPanelOpen = true">
            <span>길거리 괴롭힘이란게 뭔가요? </span>
            <img
              src="@/assets/arrowCirlcleButtonRight.svg"
              class="tour__right__button"
              alt="본문 바로가기 아코디언 버튼"
              width="12"
              height="12"
            />
          </button>
        </div>
      </div>
    </section>

    <!--  길거리 괴롭힘이란게 뭔가요? SlidePanel 컴포넌트 추가 -->
    <SlidePanel
      :width="'510px'"
      :visible="isPanelOpen"
      @close="isPanelOpen = false"
    >
      <div class="slider_wrap">
        <button class="slider_colse_button" @click="handlePanelClose">
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
          <p class="slider_contents">
            용어로도 출판이나 연출을 지칭하는 입숨을 표준 이런 들어가는 디자인
            결과물에 시각적 입숨은 그래픽 텍스트로, 텍스트로, 입숨은 분야에서
            실제적인 보여줄 무언가를 표준 로렘 무언가를 때로 입숨은 채우기
            입숨은 사용할 시각 이용된다.
          </p>
          <p class="slider_contents">
            프로젝트 채우기 사용하는 차지하는 프로젝트 보여줄 내용이 입숨을
            타이포그래피, 지칭하는 프로젝트 사용할 프로젝트 출판이나 채워지기
            디자인 보여줄 프로젝트 내용이 차지하는 시각적 사용할 연출을
            타이포그래피, 때
          </p>
        </div>

        <strong class="slider_title_sub">길거리 괴롭힘의 유형</strong>
        <ol class="slider_list">
          <li>
            <button class="slider_list_button" @click="isPanel2depsOpen = true">
              <span> 1. 바바리맨 </span>
              <img
                src="@/assets/sliderGoDetailIcon.svg"
                class="slider_list_icon"
                alt="slider arrow icon"
                width="16"
                height="16"
              />
            </button>
          </li>
          <li>
            <button class="slider_list_button">
              <span> 2. 헌팅 </span>
              <img
                src="@/assets/sliderGoDetailIcon.svg"
                class="slider_list_icon"
                alt="slider arrow icon"
                width="16"
                height="16"
              />
            </button>
          </li>
          <li>
            <button class="slider_list_button">
              <span> 3. 미행 </span>
              <img
                src="@/assets/sliderGoDetailIcon.svg"
                class="slider_list_icon"
                alt="slider arrow icon"
                width="16"
                height="16"
              />
            </button>
          </li>
          <li>
            <button class="slider_list_button">
              <span> 4. 폭행 </span>
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
    </SlidePanel>

    <SlidePanel
      :width="'510px'"
      :visible="isPanel2depsOpen"
      :right="'510px'"
      @close="isPanel2depsOpen = false"
    >
      <div class="slider_wrap slider_2deps">
        <button class="slider_colse_button" @click="isPanel2depsOpen = false">
          <img
            src="@/assets/slider2depsCloseIcon.svg"
            alt="slider 2deps close icon"
            width="36"
            height="36"
          />
        </button>

        <strong class="slider_title">1. 바바리맨</strong>
        <div class="slider_contents_wrap">
          <p class="slider_contents">
            용어로도 출판이나 연출을 지칭하는 입숨을 표준 이런 들어가는 디자인
            결과물에 시각적 입숨은 그래픽 텍스트로, 텍스트로, 입숨은 분야에서
            실제적인 보여줄 무언가를 표준 로렘 무언가를 때로 입숨은 채우기
            입숨은 사용할 시각 이용된다.
          </p>
          <p class="slider_contents">
            프로젝트 채우기 사용하는 차지하는 프로젝트 보여줄 내용이 입숨을
            타이포그래피, 지칭하는 프로젝트 사용할 프로젝트 출판이나 채워지기
            디자인 보여줄 프로젝트 내용이 차지하는 시각적 사용할 연출을
            타이포그래피, 때
          </p>
          <p class="slider_contents">
            프로젝트 채우기 사용하는 차지하는 프로젝트 보여줄 내용이 입숨을
            타이포그래피, 지칭하는 프로젝트 사용할 프로젝트 출판이나 채워지기
            디자인 보여줄 프로젝트 내용이 차지하는 시각적 사용할 연출을
            타이포그래피, 때
          </p>
          <p class="slider_contents">
            프로젝트 채우기 사용하는 차지하는 프로젝트 보여줄 내용이 입숨을
            타이포그래피, 지칭하는 프로젝트 사용할 프로젝트 출판이나 채워지기
            디자인 보여줄 프로젝트 내용이 차지하는 시각적 사용할 연출을
            타이포그래피, 때
          </p>
        </div>
      </div>
    </SlidePanel>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CarouselWrap from './carousel/CarouselWrap.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';
import { useAuthStore } from '@/store/useAuthStore';
// import { useDevice } from '@/composables/useDevice';

const auth = useAuthStore();

//auth.login()
//auth.logout()
// TODO :테스트용 임시 로그인 함수
const handleTestLogin = () => {
  auth.login({
    nickname: 'namoo',
    email: 'namoo@email.com',
  });
};

// const { isMobile } = useDevice();
const isTourOpen = ref(true);
const isMyPageOpen = ref(true);
const isPanelOpen = ref(false);
const isPanel2depsOpen = ref(false);

const handlePanelClose = () => {
  isPanelOpen.value = false;
  isPanel2depsOpen.value = false;
};

// greeting 애니메이션
const currentBubbleIndex = ref(0);

onMounted(() => {
  setInterval(() => {
    currentBubbleIndex.value = (currentBubbleIndex.value + 1) % 2;
  }, 3000);
});
</script>

<style scoped lang="scss">
.BaseCommunity {
  position: absolute;
  right: 40px;
  top: 40px;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  z-index: 9;

  &__popup {
    width: 436px;
    padding: 25px;
    border: solid 2px #f1cfc8;
    background-color: #6d54ce;
    border-radius: 20px;
    margin-bottom: 30px;
  }
  &__greeting {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
  }
  &__avatar {
    position: relative;
    margin-left: 10px;
  }
  &__avatar_eyes {
    position: absolute;
    left: -24px;
    top: 28px;
  }
  &__avatar_eyes.off {
    transform: translateY(1px);
  }
  &__bubble {
    width: 256px;
    height: 64px;
    background-color: #fff;
    padding: 12px 15px;
    border-radius: 12px 12px 12px 0;
    position: relative;
  }
  &__bubble::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 32px;
    left: 6px;
    bottom: 0;
    height: 0;
    transform: rotate(180deg) skewY(-40deg) scale(1.4, 2.005) translate(0, -50%);
    background-color: inherit;
    width: 30px;
    height: 15px;
    border-top-right-radius: 20%;
  }

  &__bubble_text {
    display: inline-block;
    color: #6d54ce;
    font-weight: 700;
    font-size: 12px;
    line-height: 1.6;
    position: relative;
    z-index: 2;
  }
  &__bubble_text > span {
    display: inline-block;
    transition: all 1s ease-in-out;
  }
  &__bubble_text > span[v-show='false'] {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }
  .next_bubble_text {
    color: #6d54ce;
    font-weight: 400;
    font-size: 12px;
    word-break: keep-all;
    position: relative;
  }
  .next_bubble_text.link {
    position: absolute;
    right: 0;
    bottom: -5px;
    text-decoration: underline;
  }

  &__hot_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    font-size: 24px;
    letter-spacing: -0.5px;
    vertical-align: middle;
    color: #fff;
  }

  &__more {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    text-decoration: underline;
    color: #fff;
    padding-top: 5px;
  }
  &__card {
    width: calc(100% + 30px);
    transform: translateX(-6px);
  }
  &__setting {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #fff;
    padding-top: 5px;
  }
  &__button_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
  &__title {
    font-weight: 700;
    font-size: 20px;
    line-height: 140%;
    letter-spacing: -0.5px;
    text-align: center;
    vertical-align: middle;
    word-break: keep-all;
    padding: 10px 30px;
  }
  &__black_button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 30px;
    background-color: #000;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    height: 40px;
    min-width: 170px;
    border-radius: 40px;
    border: 2px solid #f1cfc8;
  }
  .width_fix {
    padding: 12px;
    width: 214px;
  }
  .button_arrow_icon {
    margin-left: 2px;
  }
  .margin_15 {
    margin: 15px 0;
  }

  .icon_list_wrap {
    display: flex;
    padding: 15px 0;
    justify-content: space-between;
    border-bottom: 1px solid #9886dc;
  }
  .icon_list {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .icon_list > span {
    font-size: 14px;
    font-weight: 600;
  }
  .point_color {
    color: #00ffc2;
  }

  &__login_button {
    display: inline-block;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    vertical-align: middle;
    text-decoration: underline;
  }

  // --------- 다크맵 투어 일지 ------------
  .accordion__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    position: relative;
    min-height: 36px;
  }
  .accordion__title {
    font-size: 20px;
    font-weight: 700;
    color: #ffffff;
  }
  .accordion__toggle {
    position: absolute;
    right: -4px;
    top: 0;
    transition: transform 0.3s ease;
    &.open {
      transform: rotate(180deg);
    }
  }

  .content_text {
    margin-top: 16px;
    color: white;
    font-size: 14px;
    line-height: 2;
    font-weight: 500;
  }
  .content_text_title {
    font-weight: 500;
    font-size: 14px;
    line-height: 28px;
  }

  .highlight {
    color: #00ffc2;
    font-weight: 700;
    position: relative;
  }
  .highlight::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    display: inline-block;
    height: 6px;
    width: 100%;
    background-color: #00ffc2;
  }

  .tour__links {
    margin-top: 20px;
  }
  .tour_link_button {
    display: flex;
    align-items: center;
    padding: 4px 0;
    font-weight: 400;
    font-size: 13px;
    color: #fff;
  }
  .tour__right__button {
    margin: 2px 4px;
  }

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
}
</style>
