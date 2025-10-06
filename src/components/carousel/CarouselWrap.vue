<script setup>
import { defineProps, ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import { boardsApi } from '@/api/boards';

const cards = ref([]);
const loading = ref(false);

const loadPopularBoards = async () => {
  try {
    loading.value = true;
    const response = await boardsApi.getPopularBoards(5);
    if (response && response.data) {
      cards.value = response.data.map(board => ({
        id: board.id,
        boardId: board.id,
        url: board.imageUrl || "",
        category: board.category || '기본',
        title: board.title,
        content: board.content || '',
        authorNickname: board.nickname || '익명',
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
  itemsToShow: { type: Number, default: 1.2 },
  gap: { type: Number, default: 5 },
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
  gap: props.gap,
  autoplay: props.autoplay,
  wrapAround: props.wrapAround,
  pauseAutoplayOnHover: props.pauseAutoplayOnHover,
};
</script>

<template>
  <Carousel v-bind="carouselConfig" v-if="!loading">
    <Slide v-for="card in cards" :key="card.id">
      <div class="slide_wrap" :class="{ green: props.green }" @click="props.onCardClick && props.onCardClick(card)">
        <div class="slide_card">
          <span class="slide_card_tag">{{ card.tag }}</span>
          <span class="slide_card_arrow">
            <img :src="props.green
              ? require('@/assets/slideCardArrowGreen.svg')
              : require('@/assets/slideCardArrow.svg')
              " class="card_arrow_icon" alt="card arrow icon" width="18" height="18" />
          </span>
        </div>
        <div class="slide_card">
          <span class="slide_card_contents text_wrap">
            <span class="ellipsis__2 contents_title">{{ card.title }}</span>
            <span class="ellipsis__1 contents_detail">{{ card.contents }}</span>
          </span>
          <span class="slide_card_contents img_wrap">
            <img v-if="card.url" :src="card.url" alt="card" />
          </span>
        </div>
        <div class="slide_card lines">
          <span class="ellipsis__2 card_bottom_text user">{{ card.user }}</span>
          <span class="card_bottom_text data">{{ card.data }}</span>
          <span class="card_bottom_text count">조회수 {{ card.viewCount }}</span>
          <button class="card_bottom_button card_bottom_text">
            <span> {{ card.likeCount }}</span>
            <img :src="props.green
              ? require('@/assets/heartButtonIconGreen.svg')
              : require('@/assets/heartButtonIcon.svg')
              " class="like__toggle" alt="like toggle icon" width="16" height="16" />
          </button>
        </div>
      </div>
    </Slide>
  </Carousel>
</template>
<style scoped lang="scss">
/* .carousel {} */
.carousel__slide {
  transform: translateX(-25px);
}

.slide_wrap {
  width: 330px;
  height: 172px;
  border: 1px solid #f1cfc8;
  overflow: hidden;
  border-radius: 8px;
  background-color: #ffffff52;
  padding: 15px;
  cursor: pointer;
}

.slide_card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
}

.slide_card_tag {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #f1cfc8;
  border-radius: 20px;
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
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
}

.contents_title {
  font-weight: 700;
  font-size: 16px;
  line-height: 140%;
  letter-spacing: -0.5px;
}

.contents_detail {
  font-weight: 400;
  font-size: 12px;
  padding-top: 8px;
}

.img_wrap {
  width: 68px;
  height: 68px;
  border-radius: 8px;
  overflow: hidden;
}

.slide_card.lines {
  position: relative;
}

.slide_card.lines::after {
  content: '';
  display: flex;
  width: 328px;
  height: 1px;
  background-color: #f1cfc8;
  position: absolute;
  top: 0;
  right: 0;
  left: -14px;
}

.card_bottom_text {
  color: #f1cfc8;
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 12px;
  letter-spacing: -0.5px;
  display: inline-flex;
  gap: 5px;
  word-break: break-all;
  height: 34px;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: flex-start;
  align-items: flex-start;
  line-height: 1.2;
  padding: 4px 0;
  padding-right: 4px;
}

.card_bottom_text.user {
  width: 55px;
}

.card_bottom_text.data {
  min-width: 105px;
}

.card_bottom_text.count {
  min-width: 55px;
}

.card_bottom_button {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 4px;
  flex: auto 0 0;
  width: 68px;
  padding: 4px;
}

.slide_wrap.green {
  background-color: #01523e;
  border: 1px solid #00ffc2;
}

.slide_wrap.green .card_bottom_text {
  color: #00ffc2;
}

.slide_wrap.green .slide_card_tag {
  border: 1px solid #00ffc2;
  color: #00ffc2;
}

.slide_wrap.green .slide_card.lines::after {
  background-color: #00ffc2;
}
</style>
