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
    <!-- 게시글 슬라이더 -->
    <div class="community__card_wrap">
      <div class="community__card">
        <CarouselWrap :green="true" :items-to-show="1.66" :gap="0" />
      </div>
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

    <!-- 광장 게시글 리스트 -->
    <ul class="community_list_wrap">
      <li class="community_list">
        <button class="community_list_button">
          <span class="community_list_profile">
            <img />
          </span>
          <strong class="community_list_nickname"></strong>
          <spna class="community_list_contents">
            <span class="list_contents_tag"></span>
            <span class="list_contents_title"></span>
            <span class="list_contents_conut_wrap">
              <span class="comment_count">댓글 {{}}</span>
              <span class="like_count">좋아요 {{}}</span>
              <span class="views_count">조회 {{}}</span>
            </span>
          </spna>
        </button>
      </li>
    </ul>
  </div>
  <!-- 글등록 버튼  -->
  <div class="write_button_wrap">
    <button class="write_button">
      광장에 글쓰기
      <img
        src="@/assets/slideCardArrow.svg"
        class="button_arrow_icon"
        alt="button arrow icon"
        width="14"
        height="14"
      />
    </button>
    <button class="write_button">
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
</template>

<script setup>
// emits: close, openDetail
import { ref } from 'vue';
import CarouselWrap from '@/components/carousel/CarouselWrap.vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';

const categories = ['전체', '공지', '제보', '기억', '고민', '질문', '미분류'];
const selectedCategory = ref('전체');
</script>

<style scoped lang="scss">
/* 사이드 슬라이더 */
.slider_wrap {
  background-color: #000;
  padding: 40px 30px;
  height: calc(100% - 90px);
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
  font-size: 24px;
  font-weight: bold;
  color: #a190df;
  display: flex;
  padding-top: 20px;
}
.community__card_wrap {
  display: flex;
  transform: translateX(8px);
  position: relative;
}
.community__card_wrap::before {
  content: '';
  display: flex;
  width: 25px;
  height: 172px;
  background-color: #000;
  position: absolute;
  left: -40px;
  top: 14px;
  z-index: 1;
}
.community__card {
  width: calc(100% + 120px);
  transform: translateX(-99px);
}

// 리스트 솔팅 탭
.sort_list_wrap {
  display: flex;
  flex-direction: row;
  gap: 8px;
  margin-top: 20px;
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
.community_list_wrap {
}
// 글등록 버튼
.write_button_wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #00ffc2;
  padding: 25px 30px;
}
.write_button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 30px;
  background-color: #000;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  height: 40px;
  min-width: 214px;
  border-radius: 40px;
}
</style>
