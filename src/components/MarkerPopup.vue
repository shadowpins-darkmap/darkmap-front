<template>
  <div class="MarkerPopup" ref="popupRef" @mousedown.stop>
    <img
      @click="closeWindow"
      class="MarkerPopup__close"
      src="../assets/closePopup.svg"
    />
    <div v-if="isCluster" class="MarkerPopup__header">
      <h1>
        {{ popupTitle }}
      </h1>
    </div>
    <div class="MarkerPopup__content">
      <div v-if="isCluster" class="MarkerPopup__location">
        <span class="MarkerPopup__locationTitle">상세주소</span>
        <span class="MarkerPopup__locationAddress">{{ popupAddress }}</span>
      </div>
      <div class="MarkerPopup__incident">
        <p>
          이 지역에서 총 {{ isCluster ? article.length : 1 }}건의
          <span class="MarkerPopup__category">{{ getCategoryText }}</span>
          길거리 괴롭힘이 있었습니다.
        </p>
        <div v-if="isCluster" class="MarkerPopup__categoryCounts">
          <span
            v-for="item in categoryCounts"
            :key="item.category"
            class="MarkerPopup__categoryCount"
          >
            {{ item.category }} {{ item.count }}
          </span>
        </div>
      </div>
      <div class="MarkerPopup__articleData">
        <template v-if="selectedArticle">
          <div class="MarkerPopup__articleList MarkerPopup__articleList--detail">
            <div class="MarkerPopup__articleItem MarkerPopup__articleItem--selected">
              <span>{{ getReporterText(selectedArticle) }}</span>
              <span>{{ selectedArticle.title }}</span>
            </div>
            <div class="MarkerPopup__articleDetail scroll_area">
              {{ selectedArticle.content || selectedArticle.title }}
            </div>
          </div>
          <div class="MarkerPopup__detailActions">
            <button class="MarkerPopup__backButton" @click="selectedArticle = null">
              목록으로
            </button>
          </div>
        </template>
        <template v-else>
          <div class="MarkerPopup__articleList">
            <button
              v-for="(item, index) in paginatedArticles"
              :key="index"
              class="MarkerPopup__articleItem"
              type="button"
              @click="handleArticleClick(item)"
          >
              <span>{{ getReporterText(item) }}</span>
              <span>{{ item.title }}</span>
            </button>
          </div>
          <div class="MarkerPopup__pagination" v-if="totalPages > 1">
            <button
              class="MarkerPopup__paginationItem"
              @click="currentPage = 1"
              v-if="currentPage > 1"
            >
              <img
                :src="leftArrow"
                alt="맨 처음 페이지"
                style="transform: translateX(-2px)"
              />
              <img
                :src="leftArrow"
                alt="맨 처음 페이지"
                style="transform: translateX(2px); margin-left: -2px"
              />
            </button>
            <button
              class="MarkerPopup__paginationItem"
              @click="currentPage = Math.max(1, visiblePages[0] - 5)"
              v-if="currentPageGroup > 0"
            >
              <img :src="leftArrow" alt="이전 페이지" />
            </button>
            <button
              v-for="page in visiblePages"
              class="MarkerPopup__paginationItem"
              :key="page"
              :class="{ active: currentPage === page }"
              @click="currentPage = page"
            >
              {{ page }}
            </button>
            <button
              class="MarkerPopup__paginationItem"
              @click="
                currentPage = Math.min(
                  totalPages,
                  visiblePages[visiblePages.length - 1] + 1,
                )
              "
              v-if="currentPageGroup < Math.floor((totalPages - 1) / 5)"
            >
              <img :src="rightArrow" alt="다음 페이지" />
            </button>
            <button
              class="MarkerPopup__paginationItem"
              @click="currentPage = totalPages"
              v-if="
                currentPage < totalPages &&
                currentPageGroup < Math.floor((totalPages - 1) / 5)
              "
            >
              <img
                :src="rightArrow"
                alt="맨 끝 페이지"
                style="transform: translateX(-2px)"
              />
              <img
                :src="rightArrow"
                alt="맨 끝 페이지"
                style="transform: translateX(2px); margin-left: -2px"
              />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  defineProps,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';
import '../styles/MarkerPopup.scss';
import leftArrow from '../assets/leftArrow.svg';
import rightArrow from '../assets/rightArrow.svg';

const props = defineProps({
  closeWindow: {
    type: Function,
    required: true,
  },
  article: {
    type: [Array, Object],
    required: true,
  },
});

const popupRef = ref(null);
const isCluster = computed(() => Array.isArray(props.article));

const currentPage = ref(1);
const selectedArticle = ref(null);
const pageSize = 5;

const articleList = computed(() => {
  return Array.isArray(props.article) ? props.article : [props.article];
});

const totalPages = computed(() =>
  Math.ceil(articleList.value.length / pageSize),
);

const currentPageGroup = computed(() =>
  Math.floor((currentPage.value - 1) / 5),
);

const visiblePages = computed(() => {
  const start = currentPageGroup.value * 5 + 1;
  const end = Math.min(start + 4, totalPages.value);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return articleList.value.slice(start, start + pageSize);
});

const popupTitle = computed(() => {
  const first = articleList.value[0] || {};
  return first.sido || first.address || '경험담';
});

const popupAddress = computed(() => {
  const first = articleList.value[0] || {};
  return first.address || [first.sido, first.sigungu].filter(Boolean).join(' ');
});

const categoryCounts = computed(() => {
  const counts = articleList.value.reduce((acc, item) => {
    const category = item.category || '기타';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
});

const getReporterText = (item) => {
  return item.reporterId || item.address || '-';
};

const handleArticleClick = (item) => {
  if (item.reporterId || item.content) {
    selectedArticle.value = item;
    return;
  }
  if (item.url) {
    window.open(item.url, '_blank');
  }
};

const getCategoryText = computed(() => {
  if (isCluster.value) {
    const categories = props.article
      .map((item) => item.category)
      .filter(Boolean);
    const unique = [...new Set(categories)];
    if (unique.length === 0) return '기타';
    else if (unique.length === 1) return unique[0];
    else return '여러 유형';
  }
  return props.article.category || '기타';
});

const handleClickOutside = (event) => {
  if (popupRef.value && popupRef.value.contains(event.target)) return;
  props.closeWindow();
};

onMounted(() => {
  nextTick(() => {
    window.addEventListener('mousedown', handleClickOutside);
  });
});

onUnmounted(() => {
  window.removeEventListener('mousedown', handleClickOutside);
});
</script>
