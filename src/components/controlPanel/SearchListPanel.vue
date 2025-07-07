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
      :height="'55px'"
      gradient-color="rgba(0,0,0,1)"
    >
      <ul class="sort_list_wrap">
        <li
          v-for="(cat, i) in categories"
          :key="i"
          class="sort_list"
          :class="{ on: selectedCategory === cat }"
        >
          <button class="sort_list_button" @click="selectedCategory = cat">
            <span>{{ cat }}</span>
          </button>
        </li>
      </ul>
    </GradientScroll>
    <strong class="search_title">총 {{ nn }}건의 검색결과가 있습니다. </strong>

    <!-- 광장 게시글 리스트 -->
    <ul class="search_list_wrap scroll_area">
      <li class="search_list" v-for="item in currentItems" :key="item.id">
        <button class="search_list_button" @click="openDetail(item)">
          <span class="search_list_contents">
            <span class="tag_button_wrap">
              <span class="search_list_tag">
                {{ item.tag }}
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
            <span class="ellipsis__2 list_contents_title">
              {{ item.title }}
            </span>
          </span>
        </button>
      </li>
    </ul>
    <PaginationWrap
      :currentPage="currentPage"
      :pageNumbers="pageNumbers"
      @page-change="pageChange"
      @prev="clickPrev"
      @next="clickNext"
    />
  </div>

  <!-- SlidePanel s -->
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
</template>

<script setup>
// emits: close, openDetail
import { ref, computed } from 'vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';
import CommunityListDetailPanel from '@/components/communityPanel/CommunityListDetailPanel.vue';

import SlidePanel from '@/components/slidePanel/SlidePanel.vue';

const categories = ['전체', '뉴스', '커뮤니티'];
const selectedCategory = ref('전체');
const selectedPost = ref(null);
const keyword = ref('');

const handleSearch = () => {
  if (keyword.value.trim()) {
    // 검색 실행 로직 (emit 또는 라우팅 등)
    console.log('검색:', keyword.value);
  }
};

//  페이지네이션 상태
const currentPage = ref(1);
const itemsPerPage = 6;
// 상세 페이지 슬라이드
const isPanel2depsOpen = ref(false);

const openDetail = (item) => {
  selectedPost.value = item;
  isPanel2depsOpen.value = true;
};

// 더미 데이터 TODO
const postList = Array.from({ length: 140 }, (_, i) => ({
  id: i + 1,
  nickname: `검은 태양의 핀 ${i + 1}`,
  tag: '기억',
  title: `면목동 이사 고민 중인데 연관검색어가 면목동 살인이 ${i + 1}번 게시글`,
  comments: Math.floor(Math.random() * 200),
  likes: Math.floor(Math.random() * 20),
  views: Math.floor(Math.random() * 1000),
  userLiked: false,
  userReport: false,
}));

const totalPages = computed(() => Math.ceil(postList.length / itemsPerPage));

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
  return postList.slice(start, start + itemsPerPage);
});

const pageChange = (page) => {
  currentPage.value = page;
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

// 리스트 솔팅 탭
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
.sort_list.on > .sort_list_button {
  background-color: #00ffc2;
  font-family: 'Roboto';
  color: #000;
}
// 광장 게시글 리스트
.search_list_wrap {
  height: calc(100% - 300px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.search_list {
  display: flex;
  width: 100%;
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
