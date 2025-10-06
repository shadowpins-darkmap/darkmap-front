<template>
  <div class="slider_wrap">
    <button class="slider_colse_button" @click="$emit('close')">
      <img src="@/assets/sliderCloseIcon.svg" alt="slider close icon" width="36" height="36" />
    </button>
    <!-- 검색 인풋 -->
    <div class="search_top_input_wrap">
      <input v-model="keyword" type="text" placeholder="내가 사는 지역의 이름을 한 번 검색해보세요." class="search_top_input"
        @keyup.enter="handleSearch" />
      <button class="search_top_button" @click="handleSearch">
        <img src="@/assets/iconSearch.svg" alt="search" width="24" height="24" />
      </button>
      <p class="search_guide">
        띄어쓰기 공백을 포함해서 정확한 키워드를 입력해주세요!
      </p>
    </div>
    <!-- 리스트 솔팅 탭 -->
    <GradientScroll :width="'350px'" :height="'75px'" gradient-color="rgba(0,0,0,1)">
      <ul class="sort_list_wrap">
        <li v-for="(cat, i) in categories" :key="i" class="sort_list" :class="{ on: selectedCategory === cat }">
          <button class="sort_list_button" @click="selectedCategory = cat">
            <span>{{ cat }}</span>
          </button>
        </li>
      </ul>
    </GradientScroll>
    <strong v-if="keyword && (hasSearched || loading)" class="search_title">
      {{ loading ? '검색중입니다.' : `총 ${totalElements}건의 검색결과가 있습니다.` }}
    </strong>

    <!-- 검색된 게시글 리스트 -->
    <GradientScroll :width="'100%'" :height="'100%'" direction="vertical" gradient-color="rgba(0,0,0,1)">
      <div class="search_scroll_area">
        <ul class="search_list_wrap">
          <li class="search_list" v-for="item in currentItems" :key="item.boardId">
            <button class="search_list_button" @click="openDetail(item)">
              <span class="search_list_contents">
                <span class="tag_button_wrap">
                  <span class="search_list_tag">
                    {{ item.category }}
                  </span>
                  <span class="search_list_arrow">
                    <img src="@/assets/slideCardArrowGreen.svg" class="search_list_arrow_icon"
                      alt="search list arrow icon" width="18" height="18" />
                  </span>
                </span>
                <!-- 제목 하이라이팅 -->
                <span class="ellipsis__1 search_list_contents_title" v-html="highlightKeyword(item.title)"></span>

                <!-- 내용 하이라이팅 -->
                <span class="ellipsis__1 search_list_contents_detail"
                  v-html="highlightKeyword(item.content || '')"></span>
              </span>
            </button>
          </li>
        </ul>
        <PaginationWrap v-if="totalElements > itemsPerPage" :currentPage="currentPage" :pageNumbers="pageNumbers"
          @page-change="pageChange" @prev="clickPrev" @next="clickNext" />
      </div>
    </GradientScroll>
  </div>
  <SlidePanel :width="'510px'" :visible="isPanel2depsOpen" @close="isPanel2depsOpen = false" :left="'510px'"
    :right="'auto'">
    <CommunityListDetailPanel :post="selectedPost" @close="isPanel2depsOpen = false" />
  </SlidePanel>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue';
import { boardsApi } from '@/api/boards';
import { useNewsListStore } from '@/store/newsListStore';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';
import CommunityListDetailPanel from '@/components/communityPanel/CommunityListDetailPanel.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';

const props = defineProps({
  selectedArticle: {
    type: Object,
    default: null
  }
});

const categories = ['전체', '뉴스', '커뮤니티'];
const selectedCategory = ref('전체');
const newsStore = useNewsListStore();

watch(selectedCategory, async () => {
  if (selectedCategory.value === '뉴스') {
    if (newsStore.articles.length === 0) {
      await newsStore.loadArticles();
    }
    if (keyword.value.trim()) handleSearch();
  } else if (selectedCategory.value === '커뮤니티' && keyword.value.trim()) {
    handleSearch();
  } else if (selectedCategory.value === '전체' && keyword.value.trim()) {
    handleSearch();
  }
});
const selectedPost = ref(null);
const keyword = ref('');
const postList = ref([]);
const loading = ref(false);
const totalElements = ref(0);
const hasSearched = ref(false);

const handleSearch = async () => {
  if (!keyword.value.trim() && selectedCategory.value === '전체') return;

  loading.value = true;
  hasSearched.value = true;
  try {
    if (selectedCategory.value === '뉴스') {
      if (newsStore.articles.length === 0) {
        await newsStore.loadArticles();
      }
      const filteredArticles = keyword.value.trim()
        ? newsStore.articles.filter(article =>
          article.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
          article.address.toLowerCase().includes(keyword.value.toLowerCase())
        )
        : newsStore.articles;
      postList.value = filteredArticles;
      totalElements.value = filteredArticles.length;
    } else if (selectedCategory.value === '커뮤니티') {
      const params = {
        page: currentPage.value - 1,
        size: itemsPerPage,
        sort: 'createdAt,desc'
      };

      if (keyword.value.trim()) {
        params.keyword = keyword.value;
        params.searchType = 'TITLE';
        params.category = 'FREE';
      }

      const { data } = await boardsApi.getBoards(params);
      postList.value = Array.isArray(data?.boards) ? data.boards : [];
      totalElements.value = postList.value.length;
    } else if (selectedCategory.value === '전체') {
      if (!keyword.value.trim()) return;

      if (newsStore.articles.length === 0) {
        await newsStore.loadArticles();
      }

      const filteredNews = newsStore.articles.filter(article =>
        article.title.toLowerCase().includes(keyword.value.toLowerCase()) ||
        article.address.toLowerCase().includes(keyword.value.toLowerCase())
      );

      const { data } = await boardsApi.getBoards({
        keyword: keyword.value,
        searchType: 'TITLE',
        category: 'FREE',
        page: 0,
        size: 100,
        sort: 'createdAt,desc'
      });
      const communityPosts = Array.isArray(data?.boards) ? data.boards : [];

      postList.value = [...filteredNews, ...communityPosts];
      totalElements.value = postList.value.length;
    }
  } catch (error) {
    console.error('검색 실패:', error);
    postList.value = [];
    totalElements.value = 0;
  } finally {
    loading.value = false;
  }
};

const highlightKeyword = (text) => {
  if (!keyword.value) return text;
  const escapedKeyword = keyword.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedKeyword})`, 'gi');
  return text.replace(regex, '<mark class="highlight">$1</mark>');
};

const currentPage = ref(1);
const itemsPerPage = 10;
const isPanel2depsOpen = ref(false);

const openDetail = async (item) => {
  if (item.url) {
    window.open(item.url, '_blank');
    return;
  }

  try {
    const { data } = await boardsApi.getBoardById(item.boardId);
    selectedPost.value = data;
    isPanel2depsOpen.value = true;
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    selectedPost.value = item;
    isPanel2depsOpen.value = true;
  }
};

watch(() => props.selectedPost, (post) => {
  if (post) {
    selectedPost.value = post;
    isPanel2depsOpen.value = true;
  }
}, { immediate: true });

const totalPages = computed(() => Math.ceil(totalElements.value / itemsPerPage));

const pageNumbers = computed(() => {
  const max = 5;
  const start = Math.floor((currentPage.value - 1) / max) * max + 1;
  return Array.from(
    { length: Math.min(max, totalPages.value - start + 1) },
    (_, i) => start + i,
  );
});

const currentItems = computed(() => postList.value);

const pageChange = (page) => {
  currentPage.value = page;
  handleSearch();
};

const clickPrev = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const clickNext = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
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
}

.sort_list.on>.sort_list_button {
  background-color: #00ffc2;
  font-family: 'Roboto';
  color: #000;
}

// 광장 게시글 리스트
.search_scroll_area {
  margin: 20px 0;
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
}

.search_list_contents_detail {
  color: #fff;
  font-size: 12px;
  min-height: 15px;
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
}

.list_contents_tag {
  color: #00ffc2;
}
</style>
