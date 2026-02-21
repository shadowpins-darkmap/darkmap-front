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
    <strong class="community__hot_title">🔥 지금 가장 뜨거운 글이에요!</strong>
    <div class="community__card_wrap">
      <div class="community__card">
        <CarouselWrap
          :green="true"
          :items-to-show="1.14"
          :gap="4"
          :onCardClick="openDetail"
        />
      </div>
    </div>
    <GradientScroll
      :width="'100%'"
      :height="'48px'"
      gradient-color="rgba(0,0,0,1)"
    >
      <ul class="sort_list_wrap">
        <li
          v-for="(cat, i) in categories"
          :key="i"
          class="sort_list"
          :class="{ on: selectedCategory === cat }"
        >
          <button class="sort_list_button" @click="handleCategoryChange(cat)">
            <span>{{ cat }}</span>
          </button>
        </li>
      </ul>
    </GradientScroll>
    <ul class="community_list_wrap">
      <GradientScroll
        :width="'100%'"
        :height="'100%'"
        gradient-color="rgba(0,0,0,1)"
        direction="vertical"
      >
        <li
          class="community_list"
          v-for="item in currentItems"
          :key="item.boardId ?? item.id"
        >
          <button class="community_list_button" @click="openDetail(item)">
            <span class="community_list_profile">
              <img
                :src="(isWithdrawn(item))
                  ? require('@/assets/profileWithdrawnUser.svg')
                  : require('@/assets/profileDefaultOutline.svg')"
                alt="profile default image"
                width="34"
                height="34"
              />
            </span>
            <strong
              class="community_list_nickname"
              :class="{ withdrawn_nickname: isWithdrawn(item) }"
            >{{ (isWithdrawn(item)) ? '알수없음' : item.authorNickname }}</strong>
            <span class="community_list_contents">
              <span class="list_contents_tag">
                <img
                  src="@/assets/tagBulletIcon.svg"
                  alt="tag bullet icon"
                  width="8"
                  height="8"
                />
                {{ item.category || item.tag || '미분류' }}
              </span>
              <span class="ellipsis__2 list_contents_title">
                {{ item.title }}
              </span>
              <span class="list_contents_conut_wrap">
                <span class="views_count">조회 {{ item.viewCount }}</span>
                <span class="like_count">좋아요 {{ item.likeCount }}</span>
                <span class="comment_count">댓글 {{ item.commentCount }}</span>
              </span>
            </span>
          </button>
        </li>
      </GradientScroll>
    </ul>

    <PaginationWrap
      :currentPage="currentPage"
      :pageNumbers="pageNumbers"
      @page-change="pageChange"
      @prev="clickPrev"
      @next="clickNext"
    />
  </div>
  <!-- 글등록 버튼  -->
  <div class="write_button_wrap">
    <button class="write_button" @click="isWritePopupOpen = true">
      광장에 글쓰기
      <img
        src="@/assets/slideCardArrow.svg"
        class="button_arrow_icon"
        alt="button arrow icon"
        width="14"
        height="14"
      />
    </button>
    <button class="write_button" @click="isReportPopupOpen = true">
      길거리 괴롭힘 제보하기
      <img
        src="@/assets/slideCardArrow.svg"
        class="button_arrow_icon"
        alt="button arrow icon"
        width="14"
        height="14"
      />
    </button>
  </div>

  <!-- 팝업  -->
  <CommonPopup :visible="isWritePopupOpen" @close="isWritePopupOpen = false">
    <CommunityWriteForm
      @close="isWritePopupOpen = false"
      @submit="handleWriteComplete"
    />
  </CommonPopup>
  <CommonPopup :visible="isReportPopupOpen" @close="handleReportClose">
    <CommunityReportForm @close="handleReportClose" />
  </CommonPopup>

  <!-- SlidePanel s -->
  <SlidePanel
    :width="'380px'"
    :visible="isDetailPanelOpen"
    :right="'380px'"
    @close="isDetailPanelOpen = false"
  >
    <CommunityListDetailPanel
      :post="selectedPost"
      @close="isDetailPanelOpen = false"
    />
  </SlidePanel>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';

defineEmits(['close', 'openDetail']);
import CarouselWrap from '@/components/carousel/CarouselWrap.vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';
import CommonPopup from '@/components/commonPopup/CommonPopup.vue';
import CommunityWriteForm from '@/components/communityPopup/CommunityWriteForm.vue';
import CommunityReportForm from '@/components/communityPopup/CommunityReportForm.vue';
import CommunityListDetailPanel from '@/components/communityPanel/CommunityListDetailPanel.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';
import { boardsApi } from '@/api/boards';

const isWithdrawn = (item) =>
  item?.authorDeleted || item?.authorAnonymized || item?.authorNickname === '알수없음';

const categories = ['전체', '공지', '제보', '기억', '고민', '질문', '미분류'];
const selectedCategory = ref('전체');
const selectedPost = ref(null);
const defaultPageSize = 10;
const currentPage = ref(1);
const isDetailPanelOpen = ref(false);
const isWritePopupOpen = ref(false);
const isReportPopupOpen = ref(false);
const pageInfo = ref({
  currentPage: 0,
  pageSize: defaultPageSize,
  totalElements: 0,
  totalPages: 0,
  hasNext: false,
  hasPrevious: false,
  isFirst: true,
  isLast: false,
});

const openDetail = (item) => {
  selectedPost.value = item;
  isDetailPanelOpen.value = true;
};

const handleCategoryChange = (category) => {
  selectedCategory.value = category;
  currentPage.value = 1;
};

const postList = ref([]);
const loading = ref(false);
const pageSize = computed(() => pageInfo.value.pageSize || defaultPageSize);

const loadRecentBoards = async (page = 0) => {
  try {
    loading.value = true;
    const response = await boardsApi.getRecentBoards({
      page: page + 1,
      size: pageSize.value,
      sortBy: 'createdAt',
      direction: 'DESC',
    });
    if (response) {
      const responseData = response.data || {};
      const boards = responseData.boards || [];
      const info = responseData.pageInfo || {};
      const current =
        typeof info.currentPage === 'number' ? info.currentPage : page;
      const size =
        typeof info.pageSize === 'number' ? info.pageSize : pageSize.value;
      const totalElements =
        typeof info.totalElements === 'number'
          ? info.totalElements
          : boards.length;
      const totalPages =
        typeof info.totalPages === 'number'
          ? info.totalPages
          : size > 0
            ? Math.ceil(totalElements / size)
            : 0;
      const hasNext =
        typeof info.hasNext === 'boolean'
          ? info.hasNext
          : current + 1 < totalPages;
      const hasPrevious =
        typeof info.hasPrevious === 'boolean' ? info.hasPrevious : current > 0;
      const isFirst =
        typeof info.isFirst === 'boolean' ? info.isFirst : current === 0;
      const isLast = typeof info.isLast === 'boolean' ? info.isLast : !hasNext;

      postList.value = boards;
      pageInfo.value = {
        currentPage: current,
        pageSize: size,
        totalElements,
        totalPages,
        hasNext,
        hasPrevious,
        isFirst,
        isLast,
      };
      currentPage.value = current + 1;
    }
  } catch (error) {
    console.error('게시글 로딩 실패:', error);
    postList.value = [];
    pageInfo.value = {
      currentPage: 0,
      pageSize: defaultPageSize,
      totalElements: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false,
      isFirst: true,
      isLast: false,
    };
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

const pageNumbers = computed(() => {
  const total = pageInfo.value.totalPages || 0;
  if (total === 0) {
    return [];
  }
  const max = 5;
  const start = Math.floor((currentPage.value - 1) / max) * max + 1;
  return Array.from(
    { length: Math.min(max, total - start + 1) },
    (_, i) => start + i,
  );
});

const filteredPosts = computed(() => {
  if (selectedCategory.value === '전체') {
    return postList.value;
  }
  return postList.value.filter(
    (post) => post.category === selectedCategory.value,
  );
});

const currentItems = computed(() => {
  return filteredPosts.value;
});

const pageChange = (page) => {
  if (page < 1 || page === currentPage.value) {
    return;
  }
  const target = page - 1;
  if (target === pageInfo.value.currentPage || target < 0) {
    return;
  }
  loadRecentBoards(target);
};

const clickPrev = () => {
  if (pageInfo.value.hasPrevious) {
    loadRecentBoards(pageInfo.value.currentPage - 1);
  }
};

const clickNext = () => {
  if (pageInfo.value.hasNext) {
    loadRecentBoards(pageInfo.value.currentPage + 1);
  }
};

const handleWriteComplete = () => {
  loadRecentBoards(0);
};

const handleReportClose = () => {
  isReportPopupOpen.value = false;
};

onMounted(() => {
  loadRecentBoards();
});
</script>

<style scoped lang="scss">
/* 사이드 슬라이더 */
.slider_wrap {
  background-color: #000;
  padding: 28px 18px;
  height: calc(100% - 72px);
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

.community__hot_title {
  font-size: 21px;
  font-weight: bold;
  color: #a190df;
  display: flex;
  padding-top: 14px;
}

.community__card_wrap {
  display: flex;
  margin-top: 4px;
  position: relative;
}

.community__card_wrap::before {
  content: none;
}

.community__card {
  width: 100%;
}

// 리스트 솔팅 탭
.sort_list_wrap {
  display: flex;
  flex-direction: row;
  gap: 6px;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-right: 18px;
  padding-left: 2px;
  min-width: max-content;
}

.sort_list_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 9px;
  border-radius: 24px;
  background-color: #017357;
  font-family: 'Roboto';
  color: #fff;
  font-weight: 600;
  font-size: 13px;
}

.sort_list.on > .sort_list_button {
  background-color: #00ffc2;
  font-family: 'Roboto';
  color: #000;
}

// 광장 게시글 리스트
.community_list_wrap {
  border-top: 2px solid #00ffc2;
  border-bottom: 2px solid #00ffc2;
  height: calc(100% - 356px);
  overflow-y: scroll;
}

.community_list {
  height: 82px;
  padding: 12px 0;
  display: flex;
  position: relative;
}

.community_list::after {
  content: '';
  position: absolute;
  bottom: 0;
  background-color: #00ffc2;
  height: 1px;
  width: 100%;
}

/* .community_list:first-child::after {
  display: none;
} */
.community_list_button {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.community_list_profile {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.community_list_nickname {
  font-size: 11px;
  font-weight: 600;
  color: #a190df;
  display: flex;
  width: 72px;
  flex: 0 0 auto;
  text-align: left;
}

.community_list_contents {
  display: flex;
  flex-direction: column;
  padding-top: 4px;
  text-align: left;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.list_contents_tag {
  color: #00ffc2;
  font-size: 10px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.list_contents_title {
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  line-height: 1.4;
  display: block;
  width: auto;
  min-height: 20px;
  max-width: 100%;
  padding-top: 5px;
}

.list_contents_conut_wrap {
  color: #fff;
  display: flex;
  flex-direction: row;
  gap: 4px;
  width: 100%;
  justify-content: flex-end;
  align-self: stretch;
  white-space: nowrap;
  text-align: right;
}

.list_contents_conut_wrap > span {
  font-size: 9px;
  line-height: 1.3;
  font-weight: normal;
}

// 글등록 버튼
.write_button_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #00ffc2;
  padding: 16px 14px;
  gap: 8px;
}

.write_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 8px;
  background-color: #000;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  height: 40px;
  min-width: 0;
  width: calc(50% - 4px);
  border-radius: 40px;
  white-space: nowrap;
}

/* 탈퇴한 회원 표시 */
.withdrawn_nickname {
  color: #888888;
  font-style: italic;
}
</style>
