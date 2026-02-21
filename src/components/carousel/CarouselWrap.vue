<script setup>
import { defineProps, ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import { boardsApi } from '@/api/boards';
import { formatDate } from '@/utils/date';

const cards = ref([]);
const loading = ref(false);

const loadPopularBoards = async () => {
  try {
    loading.value = true;
    const response = await boardsApi.getPopularBoards(5);
    if (response && response.data) {
      cards.value = response.data.map((board) => ({
        id: board.id,
        boardId: board.id,
        url: board.imageUrl || '',
        category: board.category || '기본',
        title: board.title,
        content: board.content || '',
        user:
          board.authorNickname ||
          board.nickname ||
          board.author?.nickname ||
          '익명',
        authorNickname: board.authorNickname,
        authorDeleted: board.authorDeleted,
        authorAnonymized: board.authorAnonymized,
        createdAt: board.createdAt,
        viewCount: board.viewCount || 0,
        likeCount: board.likeCount || 0,
        commentCount: board.commentCount || 0,
      }));
    }
  } catch (error) {
    console.error('인기 게시글 로딩 실패:', error);
    cards.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadPopularBoards();
});

const props = defineProps({
  itemsToShow: { type: Number, default: 1.1 },
  gap: { type: Number, default: 4 },
  autoplay: { type: Number, default: 3000 },
  wrapAround: { type: Boolean, default: true },
  pauseAutoplayOnHover: { type: Boolean, default: true },
  height: { type: [String, Number], default: 200 },
  green: { type: Boolean, default: false },
  onCardClick: {
    type: Function,
    default: null,
  },
});

const carouselConfig = {
  height: props.height,
  itemsToShow: props.itemsToShow,
  snapAlign: 'start',
  gap: props.gap,
  autoplay: props.autoplay,
  wrapAround: props.wrapAround,
  pauseAutoplayOnHover: props.pauseAutoplayOnHover,
};
</script>

<template>
  <Carousel v-bind="carouselConfig" v-if="!loading">
    <Slide v-for="card in cards" :key="card.id">
      <div
        class="slide_wrap"
        :class="{ green: props.green }"
        @click="props.onCardClick && props.onCardClick(card)"
      >
        <div class="slide_card">
          <span class="slide_card_tag">{{ card.category }}</span>
          <span class="slide_card_arrow">
            <img
              :src="
                props.green
                  ? require('@/assets/slideCardArrowGreen.svg')
                  : require('@/assets/slideCardArrow.svg')
              "
              class="card_arrow_icon"
              alt="card arrow icon"
              width="18"
              height="18"
            />
          </span>
        </div>
        <div class="slide_card">
          <span class="slide_card_contents text_wrap">
            <span class="ellipsis__2 contents_title">{{ card.title }}</span>
            <span class="ellipsis__1 contents_detail">{{ card.content }}</span>
          </span>
          <span class="slide_card_contents img_wrap">
            <img v-if="card.url" :src="card.url" alt="card" />
          </span>
        </div>
        <div class="slide_card lines">
          <div class="card_bottom_meta">
            <span class="card_bottom_text user">{{ card.user }}</span>
            <span class="card_bottom_text data">{{
              formatDate(card.createdAt)
            }}</span>
            <span class="card_bottom_text count"
              >조회수 {{ card.viewCount }}</span
            >
          </div>
          <button class="card_bottom_button">
            <img
              :src="
                props.green
                  ? require('@/assets/heartButtonIconGreen.svg')
                  : require('@/assets/heartButtonIcon.svg')
              "
              class="like__toggle"
              alt="like toggle icon"
              color="#F1CFC8"
              width="16"
              height="16"
            />
            <span class="card_bottom_like_count">{{ card.likeCount }}</span>
          </button>
        </div>
      </div>
    </Slide>
  </Carousel>
</template>
<style scoped lang="scss">
/* .carousel {} */
.carousel__slide {
  transform: translateX(0);
}

.slide_wrap {
  box-sizing: border-box;
  width: 328px;
  height: 172px;
  border: 1px solid #f1cfc8;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  padding: 16px 12px 0;
  cursor: pointer;
}

.slide_card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0;
}

.slide_card:first-child {
  margin-bottom: 12px;
}

.slide_card:nth-child(2) {
  margin-bottom: 16px;
}

.slide_card_tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  height: 21px;
  line-height: 17px;
  border: 1px solid #f1cfc8;
  border-radius: 15px;
  color: #f1cfc8;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: -0.5px;
}

.slide_card_arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide_card_contents {
  display: flex;
}

.text_wrap {
  width: 224px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contents_title {
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: -0.5px;
  color: #fff;
}

.contents_detail {
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  letter-spacing: -0.5px;
  color: #fff;
}

.img_wrap {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.slide_card.lines {
  margin: 0 -12px;
  padding: 7px 10px;
  border-top: 1px solid #f1cfc8;
  justify-content: space-between;
  align-items: center;
}

.card_bottom_meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.card_bottom_text {
  color: #f1cfc8;
  font-family: 'Noto Sans KR';
  font-weight: 400;
  font-size: 11px;
  line-height: 16px;
  letter-spacing: -0.5px;
  display: block;
  word-break: keep-all;
  white-space: nowrap;
  padding: 0;
}

.card_bottom_text.user {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card_bottom_text.data {
  flex-shrink: 0;
}

.card_bottom_text.count {
  flex-shrink: 0;
}

.card_bottom_button {
  display: inline-flex;
  align-items: center;
  height: 16px;
  line-height: 1;
  width: auto;
  min-width: 35px;
  justify-content: flex-end;
  padding: 0;
  margin-left: 10px;
  flex-shrink: 0;
}

.card_bottom_like_count {
  color: #f1cfc8;
  font-family: 'Noto Sans KR';
  font-weight: 400;
  font-size: 11px;
  line-height: 16px;
  display: block;
  min-width: 10px;
}

.like__toggle {
  display: block;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

.slide_wrap.green {
  background-color: #01523e;
  border: 1px solid #00ffc2;
}

.slide_wrap.green .card_bottom_text {
  color: #00ffc2;
}

.slide_wrap.green .card_bottom_like_count {
  color: #00ffc2;
}

.slide_wrap.green .slide_card_tag {
  border: 1px solid #00ffc2;
  color: #00ffc2;
}

.slide_wrap.green .slide_card.lines {
  border-top: 1px solid #00ffc2;
}
</style>
