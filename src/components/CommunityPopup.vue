<template>
  <div class="BaseCommunity">
    <section class="BaseCommunity__popup">
      <!-- 아코디언 타이틀 클릭시 토글 -->
      <div class="accordion__header" @click="isMyPageOpen = !isMyPageOpen">
        <img
          src="@/assets/arrowCirlcleButton.svg"
          class="accordion__toggle"
          :class="{ open: isMyPageOpen }"
          alt="toggle"
          width="36"
          height="36"
        />
      </div>
      <!-- 상단 고정 말풍선 인삿말 -->
      <div class="BaseCommunity__greeting">
        <!-- <img
          class="BaseCommunity__avatar"
          src="@/assets/community-avatar.png"
          alt="avatar"
        /> -->
        <p class="BaseCommunity__bubble">
          <span v-if="isLoggedIn"
            >{{ userName }}님 안녕하세요!<br />
            오늘 하루 길거리에서 무슨 일 없으셨나요?
          </span>
          <span v-else>
            안녕하세요!<br />
            오늘 하루 길거리에서 무슨 일 없으셨나요?
          </span>
        </p>
      </div>

      <!-- 아코디언 본문 -->
      <div class="tour__content" v-show="isMyPageOpen">
        <!-- 로그인 상태일 때 -->
        <div class="BaseCommunity__contents" v-if="isLoggedIn">
          <span class="BaseCommunity__hot">지금 가장 뜨거운 글이에요!</span>

          <!-- 게시글 카드 -->
          <div class="BaseCommunity__card"></div>
        </div>
        <!-- 로그인 전 상태일 때-->
        <div v-else>
          <span class="BaseCommunity__hot">🔥 지금 가장 뜨거운 글이에요!</span>
          <button class="BaseCommunity__more">전체보기</button>
          <!-- 게시글 카드 -->
          <div class="BaseCommunity__card">
            <CarouselWrap />
          </div>
        </div>

        <!-- 로그인 유도 영역 -->
        <div class="BaseCommunity__bottom">
          <p>
            오늘 처음 방문하셨나요? 가입 이후에<br />광장의 모든 글을 보실 수
            있어요.
          </p>
          <button class="BaseCommunity__join">회원가입</button>
          <button class="BaseCommunity__login">기존 회원 로그인</button>
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
          alt="toggle"
          width="36"
          height="36"
        />
      </div>
      <!-- 아코디언 본문 -->
      <div class="tour__content" v-show="isTourOpen">
        <p>
          현재까지 <span class="highlight">123</span>명의 회원이 자신의 길거리
          괴롭힘 경험담을 <span class="highlight">12344</span>개 지역 항목에
          공유해주셨습니다. 기억에 감사드립니다.
        </p>
        <div class="tour__links">
          <p>
            <span>저도 길거리 괴롭힘을 당한 적이 있는 것 같아요 </span>
            <img
              src="@/assets/arrowCirlcleButtonRight.svg"
              class="tour__right__button"
              alt="본문 바로가기 아코디언 버튼"
              width="12"
              height="12"
            />
          </p>
          <p>
            <span>다른 사람들의 괴롭힘 경험담 이야기를 듣고 싶어요</span>
            <img
              src="@/assets/arrowCirlcleButtonRight.svg"
              class="tour__right__button"
              alt="본문 바로가기 아코디언 버튼"
              width="12"
              height="12"
            />
          </p>
          <p>
            <span>길거리 괴롭힘이란게 뭔가요? </span>
            <img
              src="@/assets/arrowCirlcleButtonRight.svg"
              class="tour__right__button"
              alt="본문 바로가기 아코디언 버튼"
              width="12"
              height="12"
            />
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CarouselWrap from './carousel/CarouselWrap.vue';
// import { useDevice } from '@/composables/useDevice';

// const { isMobile } = useDevice();
const isLoggedIn = ref(false);
const isTourOpen = ref(true);
const isMyPageOpen = ref(true);
</script>

<style scoped lang="scss">
.BaseCommunity {
  position: absolute;
  right: 40px;
  top: 40px;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  gap: 30px;
  z-index: 9;

  &__popup {
    width: 436px;
    padding: 25px;
    border: solid 2px #f1cfc8;
    background-color: #6d54ce;
    border-radius: 20px;
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
    right: 0;
    top: 0;
    transition: transform 0.3s ease;
    &.open {
      transform: rotate(180deg);
    }
  }

  .tour__content {
    margin-top: 16px;
    color: white;
    font-size: 14px;
    line-height: 2;
    font-weight: 500;

    .highlight {
      color: #00ffc2;
      font-weight: bold;
      text-decoration: underline;
    }

    .tour__links {
      margin-top: 16px;
      p {
        margin-bottom: 6px;
        cursor: pointer;
      }
    }
  }
}
</style>
