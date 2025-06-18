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
          <!-- <img
            v-show="currentBubbleIndex === 1"
            class="BaseCommunity__avatar_eyes"
            src="@/assets/eyesOff.svg"
            alt="avatar eyes"
          /> -->
        </div>
        <p class="BaseCommunity__bubble">
          <span class="BaseCommunity__bubble_text">
            <span v-show="currentBubbleIndex === 0">
              <span v-if="isLoggedIn">{{ userName }}님 </span>
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
        <div class="BaseCommunity__contents" v-if="isLoggedIn"></div>
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
        </div>

        <!-- 로그인 유도 영역 -->
        <div class="BaseCommunity__bottom_box">
          <p class="BaseCommunity__title">
            오늘 처음 방문하셨나요? 가입 이후에 광장의 모든 글을 보실 수 있어요.
          </p>
          <button class="BaseCommunity__join_button">회원가입</button>
          <button class="BaseCommunity__login_button">기존 회원 로그인</button>
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
          <button class="tour_link_button">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CarouselWrap from './carousel/CarouselWrap.vue';
// import { useDevice } from '@/composables/useDevice';

// const { isMobile } = useDevice();
const isLoggedIn = ref(false);
const isTourOpen = ref(true);
const isMyPageOpen = ref(true);

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
  &__bottom_box {
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
  &__join_button {
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
}
</style>
