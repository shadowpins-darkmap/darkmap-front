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
    <!-- 검색 인풋 -->
    <div class="search_top_input_wrap">
      <input
        v-model="keyword"
        type="text"
        placeholder="내가 사는 지역의 이름을 한 번 검색해보세요."
        class="search_top_input"
        @keyup.enter="handleSearch"
      />
      <button class="search_top_button" @click="handleSearch">
        <img
          src="@/assets/iconSearch.svg"
          alt="search"
          width="24"
          height="24"
        />
      </button>
      <p class="search_guide">
        띄어쓰기 공백을 포함해서 정확한 키워드를 입력해주세요!
      </p>
    </div>
    <!-- 리스트 솔팅 탭 -->
    <GradientScroll
      :width="'350px'"
      :height="'75px'"
      gradient-color="rgba(0,0,0,1)"
    >
      <ul class="sort_list_wrap">
        <li
          v-for="(cat, i) in categories"
          :key="i"
          class="sort_list"
          :class="{ on: selectedCategory === cat }"
        >
          <button class="sort_list_button" @click="selectCategory(cat)">
            <span>{{ cat }}</span>
          </button>
        </li>
      </ul>
    </GradientScroll>
    <strong v-if="keyword && (hasSearched || loading)" class="search_title">
      {{
        loading
          ? '검색중입니다.'
          : `총 ${totalElements}건의 검색결과가 있습니다.`
      }}
    </strong>

    <!-- 검색된 게시글 리스트 -->
    <GradientScroll
      :width="'100%'"
      :height="'100%'"
      direction="vertical"
      gradient-color="rgba(0,0,0,1)"
    >
      <div class="search_scroll_area">
        <ul v-if="currentItems.length > 0" class="search_list_wrap">
          <li class="search_list" v-for="item in currentItems" :key="item.id">
            <button class="search_list_button" @click="openDetail(item)">
              <span class="search_list_contents">
                <span class="tag_button_wrap">
                  <span class="search_list_tag">
                    {{
                      item.resultType === 'ARTICLE'
                        ? item.crimeType || '뉴스'
                        : item.category || '커뮤니티'
                    }}
                  </span>
                  <span class="search_list_arrow">
                    <img
                      src="@/assets/slideCardArrowGreen.svg"
                      class="search_list_arrow_icon"
                      alt="search list arrow icon"
                      width="18"
                      height="18"
                    />
                  </span>
                </span>
                <!-- 제목 하이라이팅 -->
                <span
                  class="ellipsis__1 search_list_contents_title"
                  v-html="highlightKeyword(item.title)"
                ></span>

                <!-- 내용 하이라이팅 -->
                <span
                  class="ellipsis__1 search_list_contents_detail"
                  v-html="highlightKeyword(item.content || '')"
                ></span>
              </span>
            </button>
          </li>
        </ul>
        <div v-else-if="hasSearched && !loading" class="no_results">
          <p>검색 결과가 없습니다.</p>
        </div>
        <PaginationWrap
          v-if="totalElements > 10"
          :currentPage="currentPage + 1"
          :pageNumbers="pageNumbers.map((p) => p + 1)"
          @page-change="(page) => pageChange(page - 1)"
          @prev="clickPrev"
          @next="clickNext"
        />
      </div>
    </GradientScroll>
  </div>
  <SlidePanel
    :width="'510px'"
    :visible="isPanel2depsOpen"
    @close="isPanel2depsOpen = false"
    :left="'510px'"
    :right="'auto'"
  >
    <CommunityListDetailPanel
      :post="selectedPost"
      @close="isPanel2depsOpen = false"
    />
  </SlidePanel>
  <BaseAlertPopup
    v-if="showErrorPopup"
    @confirm="showErrorPopup = false"
    confirmText="확인"
  >
    <p>서버에 문제가 발생했습니다.<br />잠시 후 다시 시도해주세요.</p>
  </BaseAlertPopup>
</template>

<script setup>
import { computed, defineProps, ref, watch } from 'vue';
import { boardsApi } from '@/api/boards';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import CommunityListDetailPanel from '@/components/communityPanel/CommunityListDetailPanel.vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';

const props = defineProps({
  selectedArticle: {
    type: Object,
    default: null,
  },
});

const categories = ['전체', '뉴스', '커뮤니티'];
const selectedCategory = ref('전체');
const selectedPost = ref(null);
const keyword = ref('');
const allSearchResults = ref([]);
const apiTotalElements = ref(0);
const loading = ref(false);
const hasSearched = ref(false);
const showErrorPopup = ref(false);
const currentPage = ref(0);
const itemsPerPage = 10;
const isPanel2depsOpen = ref(false);

// 카테고리 선택 함수
const selectCategory = (cat) => {
  selectedCategory.value = cat;
  currentPage.value = 0;
  if (hasSearched.value && keyword.value.trim()) {
    handleSearch();
  }
};

// 검색 함수
const handleSearch = async () => {
  if (!keyword.value.trim()) {
    console.warn('검색어가 비어있습니다.');
    return;
  }

  if (loading.value) {
    console.log('이미 검색 중입니다.');
    return;
  }

  loading.value = true;
  hasSearched.value = true;
  currentPage.value = 0;

  try {
    const data = await boardsApi.searchBoardByKeyword(
      keyword.value,
      currentPage.value + 1,
      selectedCategory.value === '전체' ? null : selectedCategory.value,
    );

    if (data?.results) {
      allSearchResults.value = data.results;
      apiTotalElements.value = data.totalElements || data.results.length;
    } else if (data && Array.isArray(data)) {
      // Fallback for array response
      allSearchResults.value = data;
      apiTotalElements.value = data.length;
    } else {
      console.warn('API 응답 형식이 예상과 다릅니다:', data);
      allSearchResults.value = [];
      apiTotalElements.value = 0;
    }

    if (allSearchResults.value.length === 0) {
      console.log('검색 결과가 없습니다.');
    }
  } catch (error) {
    console.error('검색 실패:', error);
    console.error('에러 상세:', error.response || error.message);
    allSearchResults.value = [];
    apiTotalElements.value = 0;
    showErrorPopup.value = true;
  } finally {
    loading.value = false;
  }
};

// 키워드 하이라이팅
const highlightKeyword = (text) => {
  if (!text) return '';
  if (!keyword.value) return text;

  const escapedKeyword = keyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');
  return text.replace(regex, '<mark class="highlight">$1</mark>');
};

// 상세 페이지 열기
const openDetail = async (item) => {
  console.log('상세 페이지 열기:', item);

  if (item.resultType === 'ARTICLE' && item.url) {
    window.open(item.url, '_blank');
    return;
  }

  if (item.resultType === 'BOARD') {
    try {
      const { data } = await boardsApi.getBoardById(item.id);
      selectedPost.value = data;
      isPanel2depsOpen.value = true;
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      selectedPost.value = item;
      isPanel2depsOpen.value = true;
    }
  }
};

// props 감시
watch(
  () => props.selectedPost,
  (post) => {
    if (post) {
      selectedPost.value = post;
      isPanel2depsOpen.value = true;
    }
  },
  { immediate: true },
);

// 필터링된 결과
const filteredResults = computed(() => {
  let results = allSearchResults.value;

  if (selectedCategory.value === '뉴스') {
    results = results.filter((item) => item.resultType === 'ARTICLE');
  } else if (selectedCategory.value === '커뮤니티') {
    results = results.filter((item) => item.resultType === 'BOARD');
  }

  return results;
});

// 총 개수
const totalElements = computed(() => {
  return filteredResults.value.length;
});

// 총 페이지 수
const totalPages = computed(() => {
  return Math.ceil(totalElements.value / itemsPerPage);
});

// 페이지 번호 배열
const pageNumbers = computed(() => {
  const max = 5;
  const start = Math.floor(currentPage.value / max) * max;
  return Array.from(
    { length: Math.min(max, totalPages.value - start) },
    (_, i) => start + i,
  );
});

// 현재 페이지의 아이템들
const currentItems = computed(() => {
  const start = currentPage.value * itemsPerPage;
  const end = start + itemsPerPage;
  const items = filteredResults.value.slice(start, end);
  return items;
});

// 스크롤 최상단으로
const scrollToTop = () => {
  const scrollArea = document.querySelector('.search_scroll_area');
  if (scrollArea) {
    scrollArea.scrollTop = 0;
  }
};

// 페이지 변경
const pageChange = async (page) => {
  currentPage.value = page;
  await loadPage(page);
  scrollToTop();
};

// 이전 페이지
const clickPrev = async () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    await loadPage(currentPage.value);
    scrollToTop();
  }
};

// 다음 페이지
const clickNext = async () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    await loadPage(currentPage.value);
    scrollToTop();
  }
};

// 페이지 로드 (API 호출)
const loadPage = async (page) => {
  if (loading.value) return;

  loading.value = true;
  try {
    const data = await boardsApi.searchBoardByKeyword(
      keyword.value,
      page + 1,
      selectedCategory.value === '전체' ? null : selectedCategory.value,
    );
    if (data?.results) {
      allSearchResults.value = data.results;
      apiTotalElements.value = data.totalElements || data.results.length;
    } else if (data && Array.isArray(data)) {
      allSearchResults.value = data;
      apiTotalElements.value = data.length;
    } else {
      allSearchResults.value = [];
      apiTotalElements.value = 0;
    }
  } catch (error) {
    console.error('페이지 로딩 실패:', error);
    showErrorPopup.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
/* 사이드 슬라이더 */
.slider_wrap {
  background-color: #000;
  padding: 40px 30px;
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

/* 검색 인풋 */
.search_top_input_wrap {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  margin-top: 40px;
}

.search_top_input {
  width: 100%;
  padding: 14px 50px 14px 20px;
  border-radius: 50px;
  border: 2px solid #f1cfc8;
  background-color: #d1caef;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  box-sizing: border-box;
  outline: none;
}

.search_top_input::placeholder {
  color: #000;
  opacity: 0.3;
}

.search_top_button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
}

.search_guide {
  padding: 5px 20px;
  font-size: 14px;
  color: #fff;
  text-align: left;
}

.search_title {
  font-size: 24px;
  font-weight: bold;
  color: #00ffc2;
  display: flex;
  padding: 20px 0;
}

.sort_list_wrap {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 15px;
  margin-bottom: 10px;
  padding-right: 40px;
  min-width: max-content;
}

.sort_list_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 24px;
  background-color: #017357;
  font-family: 'Roboto';
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort_list_button:hover {
  opacity: 0.8;
}

.sort_list.on > .sort_list_button {
  background-color: #00ffc2;
  font-family: 'Roboto';
  color: #000;
}

// 광장 게시글 리스트
.search_scroll_area {
  margin: 20px 0;
  min-height: 300px;
}

.search_list_wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search_list {
  display: flex;
  width: 100%;
}

.search_list_contents_title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  min-height: 18px;
  margin-top: 14px;
  margin-bottom: 12px;
  display: block;
}

.search_list_contents_detail {
  color: #fff;
  font-size: 12px;
  min-height: 15px;
  display: block;
}

.tag_button_wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search_list_tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #00ffc2;
  border: 1px solid #00ffc2;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  height: 22px;
  border-radius: 22px;
}

.search_list_button {
  display: flex;
  width: 100%;
  flex-direction: column;
  flex: 1 1 auto;
  padding: 15px;
  background-color: #017357;
  border: 1px solid #00ffc2;
  color: #fff;
  height: 118px;
  border-radius: 8px;
  flex-wrap: wrap;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search_list_button:hover {
  background-color: #018f6c;
}

.search_list_contents {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.list_contents_tag {
  color: #00ffc2;
}

/* 하이라이트 스타일 */
:deep(.highlight) {
  background-color: #ffeb3b;
  color: #000;
  font-weight: bold;
  padding: 0 2px;
}

/* ellipsis 유틸리티 클래스 */
.ellipsis__1 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

/* 검색 결과 없음 */
.no_results {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #fff;
  font-size: 16px;
}
</style>
