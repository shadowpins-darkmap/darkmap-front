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
              <span v-if="auth.isLoggedIn">{{ auth.nickname }}님 </span>
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
            ⚡️ {{ auth.nickname }}님을 위한 브리핑
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
                auth.notifications?.newComments?.length ?? 0
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
                auth.notifications?.newLikes?.length ?? 0
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
                auth.approvedReportCount ?? 0
              }}</span>
            </li>
          </ul>
          <p class="tap_count_info" v-if="currentTab === '내 게시글'">
            현재까지 총
            <span class="point_color">{{ auth.boardsTotalElements ?? 0 }}</span
            >건의 글을 작성했어요.
          </p>
          <p class="tap_count_info" v-if="currentTab === '내 댓글'">
            현재까지 총
            <span class="point_color">{{ auth.myComments?.length ?? 0 }}</span
            >건의 댓글을 작성했어요.
          </p>
          <TabButtons v-model="currentTab" :tabs="tabOptions" />

          <template v-if="alarmList.length > 3 && currentTab === '알림'">
            <button
              class="BaseCommunity__more_alarm"
              @click="showAlarmPopup = true"
            >
              전체보기
            </button>
          </template>
          <template v-if="myPostList.length > 3 && currentTab === '내 게시글'">
            <button
              class="BaseCommunity__more_alarm"
              @click="showAlarmPopup = true"
            >
              전체보기
            </button>
          </template>
          <template v-if="myCommentList.length > 3 && currentTab === '내 댓글'">
            <button
              class="BaseCommunity__more_alarm"
              @click="showAlarmPopup = true"
            >
              전체보기
            </button>
          </template>
          <ul class="alarm_list_wrap" v-if="currentTab === '알림'">
            <template v-if="alarmList.length > 0">
              <li
                class="alarm_list"
                v-for="item in alarmList.slice(0, 3)"
                :key="item.id"
              >
                <button
                  class="alarm_list_button"
                  @click="handleOpenArticleDetail(item)"
                >
                  <span class="alarm_list_icon">
                    <img
                      :src="getIcon(item.type)"
                      alt="alarm icon"
                      width="24"
                      height="24"
                    />
                  </span>
                  <span class="ellipsis__2 alarm_contents">
                    {{
                      item.type === 'comment'
                        ? `${item.nickname}님이 "${item.title}"글에 "${item.content}" 댓글을 남겼습니다.`
                        : item.type === 'like'
                          ? `${item.nickname}님이 "${item.title}"글을 추천했습니다.`
                          : `${item.nickname}님이 제보하신 ${item.title}의 사건이 다크플레이스로 등록되었습니다.`
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
                <button
                  class="alarm_list_button"
                  @click="handleOpenArticleDetail(item)"
                >
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
                <button
                  class="alarm_list_button"
                  @click="handleOpenArticleDetail(item)"
                >
                  <span class="alarm_list_icon">
                    <img
                      src="@/assets/profileDefault.svg"
                      alt="profile default image"
                      width="40"
                      height="40"
                    />
                  </span>
                  <span class="ellipsis__2 alarm_contents">{{
                    item.content
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
            <CarouselWrap :onCardClick="handleCarouselClick" />
          </div>

          <!-- 로그인 유도 영역 -->
          <div class="BaseCommunity__button_box_center">
            <p class="BaseCommunity__title">
              오늘 처음 방문하셨나요? 가입 이후에<br />
              광장의 모든 글을 보실 수 있어요.
            </p>
            <RouterLink class="BaseCommunity__black_button" to="/login">
              회원가입
            </RouterLink>
            <RouterLink class="BaseCommunity__login_button" to="/login">
              기존 회원 로그인
            </RouterLink>
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
    <!-- 다크맵 투어 일지 (고정 데이터 로그인이 필요없음) -->
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
          현재까지
          <span class="highlight">{{ statsStore.totalMemberCount }}</span> 명의
          회원이 자신의 길거리<br />
          <span class="highlight">{{ statsStore.totalBoardCount }}</span
          >가지 이야기하고<br />
          <span class="highlight">{{ statsStore.incidentReportCount }}</span
          >개의 사건 장소를 제보해주셨습니다.
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
      :width="'380px'"
      :visible="isListPanelOpen"
      @close="isListPanelOpen = false"
    >
      <CommunityListPanel
        @close="handleListPanelClose"
        @write-complete="handleCommunityWriteComplete"
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

    <!-- 게시글 상세 -->
    <SlidePanel
      :width="'380px'"
      :visible="isArticleDetailOpen"
      @close="handleArticleDetailClose"
    >
      <CommunityListDetailPanel
        :post="selectedArticleDetail"
        @close="handleArticleDetailClose"
        @deleted="handleArticleDetailDeleted"
        @updated="handleArticleDetailUpdated"
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
        @openArticleDetail="handleOpenArticleDetail"
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
  <BaseAlertPopup
    v-if="showWelcomeAlert"
    @confirm="handleWelcomeConfirm"
    confirmText="확인"
    height="169px"
  >
    <p style="margin-top: 6px">
      {{ loginUserData.nickname }}님 다시 오셨네요! <br />
      {{ loginUserData.loginCount }}번째 투어에요.
    </p>
  </BaseAlertPopup>
  <NicknameStep
    v-if="showNicknameStep"
    :nickname="loginUserData.nickname"
    @submit="handleNicknameSubmit"
  />
  <FirstVisitStep
    v-if="showFirstVisitStep"
    :nickname="loginUserData.nickname"
    @confirm="handleFirstVisitConfirm"
  />
  <MarketingConsentStep
    v-if="showMarketingStep"
    @agree="handleMarketingAgree"
    @skip="handleMarketingSkip"
  />
  <BaseAlertPopup
    v-if="showLoginAlert"
    @cancel="showLoginAlert = false"
    @confirm="handleLoginAlertConfirm"
    :showTwoButtons="true"
    cancelText="닫기"
    confirmText="로그인"
  >
    <p>로그인이 필요합니다!</p>
  </BaseAlertPopup>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import CarouselWrap from '@/components/carousel/CarouselWrap.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';
import CommunityInfoPanel from '@/components/communityPanel/CommunityInfoPanel.vue';
import CommunityInfo2depsPanel from '@/components/communityPanel/CommunityInfo2depsPanel.vue';
import CommunityListPanel from '@/components/communityPanel/CommunityListPanel.vue';
import CommunityListDetailPanel from '@/components/communityPanel/CommunityListDetailPanel.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import CommonPopup from '@/components/commonPopup/CommonPopup.vue';
import NicknameStep from '@/components/onboarding/NicknameStep.vue';
import FirstVisitStep from '@/components/onboarding/FirstVisitStep.vue';
import MarketingConsentStep from '@/components/onboarding/MarketingConsentStep.vue';
import TermsSidePanel from '@/components/commonPanel/TermsSidePanel.vue';
import AlarmListBase from '@/components/communityPopup/AlarmListBase.vue';
import AccountBase from '@/components/communityPopup/AccountBase.vue';
import TabButtons from '@/components/tabButton/TabButtons.vue';
import EmptyData from '@/components/EmptyData.vue';
import { useAuthStore } from '@/store/useAuthStore';
import { useStatsStore } from '@/store/useStatsStore';
import iconComment from '@/assets/alarmComment.svg';
import iconLike from '@/assets/alarmLike.svg';
import iconMarker from '@/assets/alarmMarker.svg';
import { RECENT_LOGIN_INFO_KEY } from '@/constant/storage';

const auth = useAuthStore();
const statsStore = useStatsStore();
const router = useRouter();

/* --------- UI 상태 --------- */
const tabOptions = ['알림', '내 게시글', '내 댓글'];
const currentTab = ref('알림');
const selectedDetailType = ref('');
const showLoginAlert = ref(false);
const showAlarmPopup = ref(false);
const showAccountSection = ref(false);

const showWelcomeAlert = ref(false);
const showNicknameStep = ref(false);
const showFirstVisitStep = ref(false);
const showMarketingStep = ref(false);
const hasHandledLoginOnboarding = ref(false);
const loginUserData = ref({
  nickname: '',
  loginCount: 0,
  marketingAgreed: null,
});
const resolveMarketingAgreed = (value, fallback = null) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof fallback === 'boolean') {
    return fallback;
  }
  return null;
};
const isPanelOpen = ref(false);
const isPanel2depsOpen = ref(false);
const isListPanelOpen = ref(false);
const isListPanel2depsOpen = ref(false);
const isTermsPanelOpen = ref(false);
const isArticleDetailOpen = ref(false);
const selectedArticleDetail = ref(null);

/* --------- 아코디언 / 인삿말 --------- */
const openSection = ref('mypage');
const toggleSection = (section) => {
  openSection.value = openSection.value === section ? null : section;
};

const currentBubbleIndex = ref(0);
let bubbleTimer = null;

/* ========== 최근 로그인 데이터 확인 ========== */
const consumeRecentLoginData = () => {
  const raw = sessionStorage.getItem(RECENT_LOGIN_INFO_KEY);
  if (!raw) {
    return null;
  }

  sessionStorage.removeItem(RECENT_LOGIN_INFO_KEY);

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('[CommunityPopup] 최근 로그인 정보 파싱 실패:', error);
    return null;
  }
};

const fetchAccountData = async () => {
  if (!auth.isLoggedIn) return;
  await Promise.all([
    auth.fetchNotifications().catch((err) => {
      console.error('알림 API 실패:', err);
    }),
    auth.getMyBoards().catch((err) => {
      console.error('내 게시글 API 실패:', err);
    }),
    auth.fetchMyComments().catch((err) => {
      console.error('내 댓글 API 실패:', err);
    }),
  ]);
};

/* ========== 초기 데이터 로딩 ========== */
const loadInitialData = async () => {
  try {
    await statsStore.fetchStats();
  } catch (error) {
    console.error('초기 데이터 로딩 실패:', error);
  }

  await fetchAccountData();
};

/* ========== 마운트 / 언마운트 ========== */
onMounted(async () => {
  const recentLoginData = consumeRecentLoginData();

  // Session is already restored in App.vue, so we just use the existing auth state
  if (recentLoginData) {
    let enrichedData = {
      nickname: recentLoginData.nickname,
      loginCount: recentLoginData.loginCount ?? 0,
      marketingAgreed: resolveMarketingAgreed(recentLoginData.marketingAgreed),
    };

    if (auth.isLoggedIn) {
      enrichedData = {
        nickname: auth.nickname ?? enrichedData.nickname,
        loginCount: auth.loginCount ?? enrichedData.loginCount,
        marketingAgreed: resolveMarketingAgreed(
          auth.marketingAgreed,
          enrichedData.marketingAgreed,
        ),
      };
    }

    // 직후 loadInitialData()가 실행되므로 중복 API 호출을 피한다.
    await handleLoginSuccess(enrichedData, { skipDataFetch: true });
  }

  // 초기 데이터 로딩
  await loadInitialData();

  // 인삿말 토글 시작
  bubbleTimer = setInterval(() => {
    currentBubbleIndex.value = (currentBubbleIndex.value + 1) % 2;
  }, 3000);
});

onBeforeUnmount(() => {
  if (bubbleTimer) clearInterval(bubbleTimer);
});

/* ========== Computed ========== */
const alarmList = computed(() => {
  if (!auth.notifications) return [];
  const isDeletedAlarm = (item, type) => {
    if (!item) return true;
    if (item.deleted || item.isDeleted) return true;
    if (item.boardDeleted || item.isBoardDeleted) return true;
    if (type === 'comment' && (item.commentDeleted || item.isCommentDeleted))
      return true;
    if (!item.boardId || !item.boardTitle) return true;
    if (type === 'comment' && !item.content) return true;
    return false;
  };

  const comments =
    auth.notifications.newComments
      ?.filter((item) => !isDeletedAlarm(item, 'comment'))
      ?.map((item) => ({
        id: item.commentId,
        type: 'comment',
        nickname: item.commenterNickname,
        title: item.boardTitle,
        content: item.content,
        createdAt: item.createdAt,
        boardId: item.boardId,
      })) || [];

  const likes =
    auth.notifications.newLikes
      ?.filter((item) => !isDeletedAlarm(item, 'like'))
      ?.map((item) => ({
        id: item.likeId,
        type: 'like',
        nickname: item.likerNickname,
        title: item.boardTitle,
        content: '',
        createdAt: item.createdAt,
        boardId: item.boardId,
      })) || [];

  const result = [...comments, ...likes].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  return result;
});

const myPostList = computed(() => auth.myBoards?.boards || []);
const myCommentList = computed(() => auth.myComments || []);

/* ========== 유틸 ========== */
const getIcon = (type) => {
  switch (type) {
    case 'comment':
      return iconComment;
    case 'like':
      return iconLike;
    case '등록':
      return iconMarker;
    default:
      return iconComment;
  }
};

/* ========== 페이징 ========== */
const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() => {
  let totalLength = 0;
  if (currentTab.value === '알림') totalLength = alarmList.value.length;
  else if (currentTab.value === '내 게시글')
    totalLength = myPostList.value.length;
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
  if (currentTab.value === '알림') return alarmList.value.slice(start, end);
  if (currentTab.value === '내 게시글')
    return myPostList.value.slice(start, end);
  if (currentTab.value === '내 댓글')
    return myCommentList.value.slice(start, end);
  return [];
});

const pageChange = (p) => (currentPage.value = p);
const clickPrev = () => currentPage.value > 1 && currentPage.value--;
const clickNext = () =>
  currentPage.value < totalPages.value && currentPage.value++;

/* ========== 로그인 상태 변화 감지 (온보딩 플로우 트리거) ========== */
watch(
  () => auth.isLoggedIn,
  async (isLoggedIn, wasLoggedIn) => {
    if (!isLoggedIn) {
      hasHandledLoginOnboarding.value = false;
      return;
    }
    if (wasLoggedIn || hasHandledLoginOnboarding.value) return;

    const recentLoginData = consumeRecentLoginData();
    if (!recentLoginData) return;
    hasHandledLoginOnboarding.value = true;

    const enrichedData = {
      nickname: auth.nickname ?? recentLoginData.nickname,
      loginCount: auth.loginCount ?? recentLoginData.loginCount ?? 0,
      marketingAgreed: resolveMarketingAgreed(
        auth.marketingAgreed,
        recentLoginData.marketingAgreed,
      ),
    };

    try {
      // 로그인 직후 API 401 연쇄를 피하기 위해 온보딩 표시를 우선 처리한다.
      await handleLoginSuccess(enrichedData, { skipDataFetch: true });
    } catch (error) {
      hasHandledLoginOnboarding.value = false;
      console.warn('[CommunityPopup] 로그인 온보딩 처리 실패:', error);
    }
  },
);

/* ========== Watchers ========== */
watch(currentTab, async (next) => {
  currentPage.value = 1;
  if (next === '내 댓글' && auth.isLoggedIn && !auth.myCommentsLoaded) {
    try {
      await auth.fetchMyComments();
    } catch (err) {
      console.error('내 댓글 API 실패:', err);
    }
  }
});

watch(showAlarmPopup, (v) => {
  if (!v) currentPage.value = 1;
  if (
    v &&
    currentTab.value === '내 댓글' &&
    auth.isLoggedIn &&
    !auth.myCommentsLoaded
  ) {
    auth.fetchMyComments().catch((err) => {
      console.error('내 댓글 API 실패:', err);
    });
  }
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
  if (!auth.isLoggedIn) {
    showLoginAlert.value = true;
  } else {
    selectedArticleDetail.value = card;
    isArticleDetailOpen.value = true;
  }
};

const handleCommunityMove = () => {
  if (!auth.isLoggedIn) showLoginAlert.value = true;
  isListPanelOpen.value = true;
};

const handleCommunityWriteComplete = async () => {
  if (!auth.isLoggedIn) {
    return;
  }

  try {
    await auth.getMyBoards();
  } catch (error) {
    console.error('내 게시글 새로고침 실패:', error);
  }
};

const handleOpenArticleDetail = (article) => {
  selectedArticleDetail.value = article;
  showAlarmPopup.value = false;
  isArticleDetailOpen.value = true;
};

const handleArticleDetailClose = () => {
  isArticleDetailOpen.value = false;
  selectedArticleDetail.value = null;
};

const handleArticleDetailDeleted = async () => {
  isArticleDetailOpen.value = false;
  selectedArticleDetail.value = null;
  if (!auth.isLoggedIn) return;
  try {
    await auth.getMyBoards();
  } catch (error) {
    console.error('내 게시글 새로고침 실패:', error);
  }
};

const handleArticleDetailUpdated = async () => {
  if (!auth.isLoggedIn) return;
  try {
    await auth.getMyBoards();
  } catch (error) {
    console.error('내 게시글 새로고침 실패:', error);
  }
};

/* ========== 로그인 관련 핸들러 ========== */
const handleLoginSuccess = async (userData, { skipDataFetch = false } = {}) => {
  const normalizedMarketing = resolveMarketingAgreed(
    userData.marketingAgreed,
    auth.marketingAgreed,
  );

  loginUserData.value = {
    nickname: userData.nickname ?? '',
    loginCount: userData.loginCount ?? 0,
    marketingAgreed: normalizedMarketing,
  };

  if (
    typeof normalizedMarketing === 'boolean' &&
    normalizedMarketing !== auth.marketingAgreed
  ) {
    auth.marketingAgreed = normalizedMarketing;
  }

  if (!skipDataFetch) {
    await fetchAccountData();
  }

  if (showWelcomeAlert.value || showNicknameStep.value) return;

  if (userData.loginCount >= 2) {
    showWelcomeAlert.value = true;
  } else {
    showNicknameStep.value = true;
  }
};

const handleLoginAlertConfirm = () => {
  showLoginAlert.value = false;
  router.push('/login');
};

const handleWelcomeConfirm = async () => {
  showWelcomeAlert.value = false;
  await loadInitialData();
};

const handleNicknameSubmit = (newNickname) => {
  loginUserData.value.nickname = newNickname;
  showNicknameStep.value = false;
  showFirstVisitStep.value = true;
};

const handleFirstVisitConfirm = () => {
  showFirstVisitStep.value = false;
  const alreadyHandled = resolveMarketingAgreed(
    auth.marketingAgreed,
    loginUserData.value.marketingAgreed,
  );
  if (alreadyHandled === true) {
    showMarketingStep.value = false;
    return;
  }
  showMarketingStep.value = true;
};

const handleMarketingAgree = () => {
  auth.marketingAgreed = true;
  loginUserData.value.marketingAgreed = true;
  showMarketingStep.value = false;
};

const handleMarketingSkip = () => {
  auth.marketingAgreed = false;
  loginUserData.value.marketingAgreed = false;
  showMarketingStep.value = false;
};
</script>

<style scoped lang="scss">
.BaseCommunity {
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
  z-index: 9;
  gap: 15px;

  &__popup {
    width: 320px;
    padding: 15px;
    border: solid 2px #f1cfc8;
    background-color: #6d54ce;
    border-radius: 16px;
  }

  // 알람
  &__greeting {
    display: flex;
    justify-content: space-between;
    padding-top: 6px;
  }

  &__avatar {
    position: relative;
    margin-left: 6px;
    transform: scale(0.7);
    transform-origin: top left;
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
    width: 200px;
    height: 50px;
    background-color: #fff;
    padding: 8px 10px;
    border-radius: 10px 10px 10px 0;
    position: relative;
  }

  &__bubble::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 25px;
    left: 4px;
    bottom: 0;
    height: 0;
    transform: rotate(180deg) skewY(-40deg) scale(1.26, 1.8) translate(0, -50%);
    background-color: inherit;
    width: 30px;
    height: 10px;
    border-top-right-radius: 10%;
  }

  &__bubble_text {
    display: inline-block;
    color: #6d54ce;
    font-weight: 700;
    font-size: 10px;
    line-height: 1.5;
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
    font-size: 10px;
    word-break: keep-all;
    position: relative;
  }

  .next_bubble_text.link {
    position: absolute;
    right: 0;
    bottom: -3px;
    text-decoration: underline;
    font-size: 9px;
  }

  &__hot_title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: -0.5px;
    vertical-align: middle;
    color: #fff;
    line-height: 1.3;
  }

  &__more {
    font-weight: 600;
    font-size: 11px;
    line-height: 14px;
    text-decoration: underline;
    color: #fff;
    padding-top: 3px;
  }

  &__card {
    width: 100%;
    overflow: hidden;
  }

  &__setting {
    font-weight: 600;
    font-size: 11px;
    line-height: 14px;
    color: #fff;
    padding-top: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    gap: 2px;
  }

  &__button_box {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-right: 10px;
    justify-content: center;
    gap: 8px;
  }

  &__button_box_center {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  &__title {
    font-weight: 700;
    font-size: 14px;
    line-height: 140%;
    letter-spacing: -0.5px;
    text-align: center;
    vertical-align: middle;
    word-break: keep-all;
    padding: 6px 15px;
  }

  &__black_button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    background-color: #000;
    color: #fff;
    font-weight: 700;
    font-size: 11px;
    height: 32px;
    min-width: 120px;
    border-radius: 32px;
    border: 2px solid #f1cfc8;
  }

  .width_fix {
    padding: 8px;
    width: 160px;
  }

  .button_arrow_icon {
    margin-left: 2px;
    width: 10px;
    height: 10px;
  }

  .margin_15 {
    margin: 10px 0;
  }

  .tap_count_info {
    font-size: 11px;
    color: #fff;
    margin-bottom: 8px;
  }

  .icon_list_wrap {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px;
  }

  .icon_list {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .icon_list > span {
    font-size: 10px;
    font-weight: 600;
  }

  .my_list_icon {
    width: 12px;
    height: 12px;
  }

  .point_color {
    color: #00ffc2;
  }

  &__more_alarm {
    font-weight: 600;
    font-size: 11px;
    line-height: 14px;
    color: #fff;
    display: flex;
    width: 100%;
    flex-direction: row-reverse;
    margin-top: 8px;
    margin-bottom: 4px;
  }

  &__login_button {
    display: inline-block;
    color: #fff;
    font-weight: 600;
    font-size: 11px;
    text-align: center;
    vertical-align: middle;
    text-decoration: underline;
  }

  // ------- alarm list

  .alarm_list_wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .alarm_list_button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-radius: 6px;
    background-color: #4c3d86;
    text-align: left;
  }

  // 알람의 첫번째, 두번째, 세번째 스타일
  .alarm_list:nth-of-type(1) > .alarm_list_button {
    background-color: #9886dc;
  }

  .alarm_list:nth-of-type(2) > .alarm_list_button {
    background-color: #8975d7;
  }

  .alarm_list:nth-of-type(3) > .alarm_list_button {
    background-color: #7e68d4;
  }

  .alarm_list_icon {
    width: 28px;
    height: 28px;
    border-radius: 28px;
    background-color: #d2cbf0;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 16px;
      height: 16px;
    }
  }

  .alarm_contents {
    display: flex;
    width: calc(100% - 36px);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
  }

  // --------- 다크맵 투어 일지 ------------
  .accordion__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    position: relative;
    min-height: 28px;
    width: 100%;
  }

  .accordion__title {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }

  .accordion__toggle {
    position: absolute;
    right: -4px;
    top: 0;
    transition: transform 0.3s ease;
    width: 24px;
    height: 24px;

    &.open {
      transform: rotate(180deg);
    }
  }

  .content_text {
    margin-top: 10px;
    color: white;
    font-size: 11px;
    line-height: 1.8;
    font-weight: 500;
  }

  .content_text_title {
    font-weight: 500;
    font-size: 11px;
    line-height: 20px;
  }

  .highlight {
    color: #00ffc2;
    font-weight: 700;
    position: relative;
  }

  .highlight::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    display: inline-block;
    height: 4px;
    width: 100%;
    background-color: #00ffc2;
  }

  .tour__links {
    margin-top: 12px;
  }

  .tour_link_button {
    display: flex;
    align-items: center;
    padding: 3px 0;
    font-weight: 400;
    font-size: 10px;
    color: #fff;
  }

  .tour__right__button {
    margin: 1px 3px;
    width: 10px;
    height: 10px;
  }
}
</style>
