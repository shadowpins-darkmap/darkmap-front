<template>
  <div class="BaseCommunity">
    <section class="BaseCommunity__popup base" v-if="!showAccountSection">
      <!-- 아코디언 타이틀 클릭시 토글 -->
      <button class="accordion__header" @click="toggleSection('mypage')">
        <img
          src="@/assets/arrowCirlcleButton.svg"
          class="accordion__toggle"
          :class="{ open: openSection === 'mypage' }"
          alt="accordion toggle icon"
          width="36"
          height="36"
        />
      </button>
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
                href="https://dune-purple-f80.notion.site/20025ce1e4e980408240ff907e3ca889?source=copy_link"
                target="_blank"
                class="next_bubble_text link"
                >전문 보러가기</a
              >
            </span>
          </span>
        </p>
      </div>

      <!-- 아코디언 본문 -->
      <div class="content_text" v-show="openSection === 'mypage'">
        <!-- 로그인 상태일 때 -->
        <div class="BaseCommunity__contents" v-if="auth.isLoggedIn">
          <div class="BaseCommunity__button_box">
            <button
              class="BaseCommunity__black_button width_fix"
              @click="isListPanelOpen = true"
            >
              광장에 얘기하러 가기
              <img
                src="@/assets/slideCardArrow.svg"
                class="button_arrow_icon"
                alt="button arrow icon"
                width="14"
                height="14"
              />
            </button>
            <button
              class="BaseCommunity__black_button width_fix"
              @click="isListPanelOpen = true"
            >
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
            <button
              class="BaseCommunity__setting"
              @click="showAccountSection = true"
            >
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
          <!-- 알림 - 내 활동 내역 -->
          <ul class="icon_list_wrap" v-if="currentTab === '알림'">
            <li class="icon_list">
              <img
                src="@/assets/iconListComment.svg"
                class="my_list_icon"
                alt="my list icon"
                width="16"
                height="16"
              />
              <span>새 댓글</span>
              <span class="point_color">{{
                auth.user?.commentCount ?? 0
              }}</span>
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
              <span class="point_color">{{
                auth.user?.commentCount ?? 0
              }}</span>
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
              <span class="point_color">{{
                auth.user?.commentCount ?? 0
              }}</span>
            </li>
          </ul>
          <p class="tap_count_info" v-if="currentTab === '내 게시글'">
            현재까지 총
            <span class="point_color">{{ auth.user?.commentCount ?? 0 }}</span
            >건의 글을 작성했어요.
          </p>
          <p class="tap_count_info" v-if="currentTab === '내 댓글'">
            현재까지 총
            <span class="point_color">{{ auth.user?.commentCount ?? 0 }}</span
            >건의 댓글을 작성했어요.
          </p>
          <TabButtons v-model="currentTab" :tabs="tabOptions" />
          <!-- 알림 -->
          <button
            class="BaseCommunity__more_alarm"
            @click="showAlarmPopup = true"
          >
            전체보기
          </button>

          <ul class="alarm_list_wrap" v-if="currentTab === '알림'">
            <template v-if="alarmList.length > 0">
              <li
                class="alarm_list"
                v-for="item in alarmList.slice(0, 3)"
                :key="item.id"
              >
                <button class="alarm_list_button">
                  <span class="alarm_list_icon">
                    <img
                      :src="getIcon(item.tag)"
                      alt="alarm icon"
                      width="24"
                      height="24"
                    />
                  </span>
                  <span class="ellipsis__2 alarm_contents">
                    {{
                      `${item.nickname}님이 ${item.tag} '${item.title}'을(를) 남겼습니다.`
                    }}
                  </span>
                </button>
              </li>
            </template>
            <template v-else>
              <EmptyData type="알림" />
            </template>
          </ul>
          <!-- 내 게시글 -->
          <ul class="alarm_list_wrap" v-if="currentTab === '내 게시글'">
            <template v-if="myPostList.length > 0">
              <li
                class="alarm_list"
                v-for="item in myPostList.slice(0, 3)"
                :key="item.id"
              >
                <button class="alarm_list_button">
                  <span class="alarm_list_icon">
                    <img
                      src="@/assets/profileDefault.svg"
                      alt="profile default image"
                      width="40"
                      height="40"
                    />
                  </span>
                  <span class="ellipsis__2 alarm_contents">{{
                    item.title
                  }}</span>
                </button>
              </li>
            </template>
            <template v-else>
              <EmptyData type="게시글" />
            </template>
          </ul>
          <!-- 내 댓글 -->
          <ul class="alarm_list_wrap" v-if="currentTab === '내 댓글'">
            <template v-if="myCommentList.length > 0">
              <li
                class="alarm_list"
                v-for="item in myCommentList.slice(0, 3)"
                :key="item.id"
              >
                <button class="alarm_list_button">
                  <span class="alarm_list_icon">
                    <img
                      src="@/assets/profileDefault.svg"
                      alt="profile default image"
                      width="40"
                      height="40"
                    />
                  </span>
                  <span class="ellipsis__2 alarm_contents">{{
                    item.comment
                  }}</span>
                </button>
              </li>
            </template>
            <template v-else>
              <EmptyData type="댓글" />
            </template>
          </ul>
        </div>
        <!-- 로그인 전 상태일 때-->
        <div v-else>
          <p class="BaseCommunity__hot_title">
            🔥 지금 가장 뜨거운 글이에요!
            <button class="BaseCommunity__more" @click="showLoginAlert = true">
              전체보기
            </button>
          </p>
          <!-- 게시글 슬라이더 -->
          <div class="BaseCommunity__card">
            <CarouselWrap :onCardClick="(card) => handleCarouselClick(card)" />
          </div>

          <!-- 로그인 유도 영역 -->
          <div class="BaseCommunity__button_box_center">
            <p class="BaseCommunity__title">
              오늘 처음 방문하셨나요? 가입 이후에 광장의 모든 글을 보실 수
              있어요.
            </p>
            <button
              class="BaseCommunity__black_button"
              @click="showLoginAlert = true"
            >
              회원가입
            </button>
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
    <section class="BaseCommunity__popup base" v-if="showAccountSection">
      <AccountBase
        @back="showAccountSection = false"
        @open-terms-panel="isTermsPanelOpen = true"
      />
    </section>
    <!-- 다크맵 투어 일지 (고정) -->
    <section class="BaseCommunity__popup">
      <!-- 아코디언 타이틀 클릭시 토글 -->
      <button class="accordion__header" @click="toggleSection('tour')">
        <strong class="accordion__title">K-다크맵 투어 일지</strong>
        <img
          src="@/assets/arrowCirlcleButton.svg"
          class="accordion__toggle"
          :class="{ open: openSection === 'tour' }"
          alt="accordion toggle icon"
          width="36"
          height="36"
        />
      </button>
      <!-- 아코디언 본문 -->
      <div class="content_text" v-show="openSection === 'tour'">
        <p class="content_text_title">
          현재까지 <span class="highlight">123</span> 명의 회원이 자신의 길거리
          괴롭힘 경험담을 <br />
          <span class="highlight">12344</span>가지 이야기하고<br />
          <span class="highlight">12344</span>개의 사건 장소를 제보해주셨습니다.
          기여에 감사드립니다.
        </p>
        <div class="tour__links">
          <button class="tour_link_button" @click="handleCommunityMove">
            <span>저도 길거리 괴롭힘을 당한 적이 있는 것 같아요 </span>
            <img
              src="@/assets/arrowCirlcleButtonRight.svg"
              class="tour__right__button"
              alt="본문 바로가기 아코디언 버튼"
              width="12"
              height="12"
            />
          </button>
          <button class="tour_link_button" @click="handleCommunityMove">
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

    <!-- SlidePanels -->
    <!--  길거리 괴롭힘이란게 뭔가요? SlidePanel -->
    <SlidePanel
      :width="'510px'"
      :visible="isPanelOpen"
      @close="isPanelOpen = false"
    >
      <CommunityInfoPanel
        @close="handlePanelClose"
        @openDetail="handleOpenDetail"
        :detailType="selectedDetailType"
      />
    </SlidePanel>

    <SlidePanel
      :width="'510px'"
      :visible="isPanel2depsOpen"
      :right="'510px'"
      @close="isPanel2depsOpen = false"
    >
      <CommunityInfo2depsPanel
        @close="isPanel2depsOpen = false"
        :detailType="selectedDetailType"
      />
    </SlidePanel>

    <!-- 광장 커뮤니티  SlidePanel -->
    <SlidePanel
      :width="'510px'"
      :visible="isListPanelOpen"
      @close="isListPanelOpen = false"
    >
      <CommunityListPanel
        @close="handleListPanelClose"
        @openDetail="isListPanelOpen = true"
      />
    </SlidePanel>

    <!-- 사이트 이용약관 -->
    <SlidePanel
      :width="'510px'"
      :visible="isTermsPanelOpen"
      @close="isTermsPanelOpen = false"
      :right="'auto'"
      :left="'0'"
    >
      <TermsSidePanel
        @close="isTermsPanelOpen = false"
        @open-terms-panel="isTermsPanelOpen = true"
      />
    </SlidePanel>
  </div>
  <!-- 팝업  -->
  <CommonPopup :visible="showAlarmPopup" @close="showAlarmPopup = false">
    <!-- 알람 리스트 영역 -->
    <section class="alarm">
      <AlarmListBase
        :items="currentItems"
        :currentTab="currentTab"
        :currentPage="currentPage"
        :itemsPerPage="itemsPerPage"
      />
      <PaginationWrap
        :currentPage="currentPage"
        :pageNumbers="pageNumbers"
        @page-change="pageChange"
        @prev="clickPrev"
        @next="clickNext"
      />
    </section>
  </CommonPopup>
  <CommonPopup :visible="showLoginPopup" @close="showLoginPopup = false">
    <LoginPopup></LoginPopup>
  </CommonPopup>
  <BaseAlertPopup
    v-if="showLoginAlert"
    @cancel="showLoginAlert = false"
    @confirm="
      () => {
        showLoginPopup = true;
        showLoginAlert = false;
      }
    "
    :showTwoButtons="true"
    cancelText="닫기"
    confirmText="로그인"
  >
    <p>로그인이 필요합니다!</p>
  </BaseAlertPopup>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import CarouselWrap from '@/components/carousel/CarouselWrap.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';
import CommunityInfoPanel from '@/components/communityPanel/CommunityInfoPanel.vue';
import CommunityInfo2depsPanel from '@/components/communityPanel/CommunityInfo2depsPanel.vue';
import CommunityListPanel from '@/components/communityPanel/CommunityListPanel.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import LoginPopup from '@/components/commonPopup/LoginPopup.vue';
import CommonPopup from '@/components/commonPopup/CommonPopup.vue';
import TermsSidePanel from '@/components/commonPanel/TermsSidePanel.vue';
import AlarmListBase from '@/components/communityPopup/AlarmListBase.vue';
import AccountBase from '@/components/communityPopup/AccountBase.vue';
import TabButtons from '@/components/tabButton/TabButtons.vue';
import EmptyData from '@/components/EmptyData.vue';
import { useAuthStore } from '@/store/useAuthStore';
import iconComment from '@/assets/alarmComment.svg';
import iconLike from '@/assets/alarmLike.svg';
import iconMarker from '@/assets/alarmMarker.svg';

const auth = useAuthStore();

/* --------- UI 상태 --------- */
const tabOptions = ['알림', '내 게시글', '내 댓글'];
const currentTab = ref('알림');
const selectedDetailType = ref('');
const showLoginAlert = ref(false);
const showLoginPopup = ref(false);
const showAlarmPopup = ref(false);
const showAccountSection = ref(false);

const isPanelOpen = ref(false);
const isPanel2depsOpen = ref(false);
const isListPanelOpen = ref(false);
const isListPanel2depsOpen = ref(false);
const isTermsPanelOpen = ref(false);

/* --------- 아코디언 / 인삿말 --------- */
const openSection = ref('mypage');
const toggleSection = (section) => {
  openSection.value = openSection.value === section ? null : section;
};

const currentBubbleIndex = ref(0);
let bubbleTimer = null;

onMounted(() => {
  // 로컬스토리지 토큰 복구 → 자동 로그인
  auth.initFromStorage();

  // 인삿말 토글
  bubbleTimer = setInterval(() => {
    currentBubbleIndex.value = (currentBubbleIndex.value + 1) % 2;
  }, 3000);
});
onBeforeUnmount(() => {
  if (bubbleTimer) clearInterval(bubbleTimer);
});

/* --------- 로그인 후 반응 --------- */
watch(
  () => auth.isLoggedIn,
  (loggedIn) => {
    if (loggedIn) {
      // 로그인 팝업 닫기
      showLoginPopup.value = false;
      // 사용자 정보가 없으면 최초로 불러오기(스토어에 fetchAll 구현)
      if (!auth.me) auth.fetchAll();
    }
  },
  { immediate: true },
);

/* --------- 더미 데이터 (UI 확인용) --------- */
const alarmList = Array.from({ length: 140 }, (_, i) => ({
  id: i + 1,
  nickname: `검은 태양의 핀 ${i + 1}`,
  tag: '좋아요',
  title: `면목동 이사 고민 중인데 연관검색어가 면목동 살인이 ${i + 1}번 게시글`,
}));
const myPostList = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `면목동 이사 고민 중인데 연관검색어가 면목동 살인이 ${i + 1}번 게시글`,
}));
const myCommentList = ref(
  Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    comment: `면목동 이사 고민 중인데 연관검색어가 면목동 살인이 ${i + 1}번 comment`,
  })),
);

/* --------- 유틸 --------- */
const getIcon = (tag) => {
  switch (tag) {
    case '댓글':
      return iconComment;
    case '좋아요':
      return iconLike;
    case '등록':
      return iconMarker;
    default:
      return iconComment;
  }
};

/* --------- 페이징 --------- */
const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() => {
  let totalLength = 0;
  if (currentTab.value === '알림') totalLength = alarmList.length;
  else if (currentTab.value === '내 게시글') totalLength = myPostList.length;
  else if (currentTab.value === '내 댓글')
    totalLength = myCommentList.value.length;
  return Math.ceil(totalLength / itemsPerPage);
});

const pageNumbers = computed(() => {
  const max = 5;
  const start = Math.floor((currentPage.value - 1) / max) * max + 1;
  return Array.from(
    { length: Math.min(max, totalPages.value - start + 1) },
    (_, i) => start + i,
  );
});

const currentItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  if (currentTab.value === '알림') return alarmList.slice(start, end);
  if (currentTab.value === '내 게시글') return myPostList.slice(start, end);
  if (currentTab.value === '내 댓글')
    return myCommentList.value.slice(start, end);
  return [];
});

const pageChange = (p) => (currentPage.value = p);
const clickPrev = () => currentPage.value > 1 && currentPage.value--;
const clickNext = () =>
  currentPage.value < totalPages.value && currentPage.value++;

watch(showAlarmPopup, (v) => {
  if (!v) currentPage.value = 1;
});

/* --------- 버튼 핸들러 --------- */
const handleOpenDetail = (type) => {
  selectedDetailType.value = type;
  isPanel2depsOpen.value = true;
};

const handleListPanelClose = () => {
  isListPanelOpen.value = false;
  isListPanel2depsOpen.value = false;
};

const handlePanelClose = () => {
  isPanelOpen.value = false;
  isPanel2depsOpen.value = false;
};

const handleCarouselClick = (card) => {
  console.log('카드 클릭됨!', card);
  if (!auth.isLoggedIn) showLoginAlert.value = true;
};

const handleCommunityMove = () => {
  if (!auth.isLoggedIn) showLoginAlert.value = true;
  isListPanelOpen.value = true;
};
</script>

<style scoped lang="scss">
.BaseCommunity {
  position: absolute;
  right: 40px;
  top: 40px;
  display: flex;
  flex-direction: column;
  z-index: 9;
  gap: 30px;

  &__popup {
    width: 436px;
    padding: 25px;
    border: solid 2px #f1cfc8;
    background-color: #6d54ce;
    border-radius: 20px;
  }

  // 알람
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
    align-items: flex-end;
    margin-right: 20px;
    justify-content: center;
    gap: 15px;
  }
  &__button_box_center {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
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
    /* padding: 15px 0; */
    justify-content: space-between;
    /* border-bottom: 1px solid #9886dc; */
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

  &__more_alarm {
    font-weight: 600;
    font-size: 14px;
    line-height: 18px;
    color: #fff;
    display: flex;
    width: 100%;
    flex-direction: row-reverse;
    margin-top: 15px;
    margin-bottom: 5px;
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

  // ------- alarm list

  .alarm_list_wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .alarm_list_button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    border-radius: 6px;
    background-color: #4c3d86;
    text-align: left;
  }
  // 알람의 첫번째, 두번째, 세번째 스타일
  .alarm_list:nth-of-type(1) > .alarm_list_button {
    background-color: #9886dc;
    /* border: 1px solid #fff; */
  }
  .alarm_list:nth-of-type(2) > .alarm_list_button {
    background-color: #8975d7;
    /* border: 1px solid #fff; */
  }
  .alarm_list:nth-of-type(3) > .alarm_list_button {
    background-color: #7e68d4;
    /* border: 1px solid #fff; */
  }

  .alarm_list_icon {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background-color: #d2cbf0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .alarm_contents {
    display: flex;
    width: calc(100% - 50px);
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }
  // --------- 다크맵 투어 일지 ------------
  .accordion__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    position: relative;
    min-height: 36px;
    width: 100%;
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
