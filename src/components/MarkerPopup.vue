<template>
  <div class="popup" ref="popupRef" @mousedown.stop>
    <img @click="closeWindow" class="close" src="../assets/closePopup.svg" />
    <div class="popup-header">
      <h1>
        {{
          isCluster
            ? `${article[0].sido}`
            : `${article.sido} ${article.sigungu}`
        }}
      </h1>
    </div>

    <div class="article-container">
      <div class="location-info">
        <span class="location-badge">상세주소</span>
        <span class="address">{{
          isCluster ? '' : article.address
        }}</span>
      </div>

      <div class="incident-count">
        <p>
          이 지역에서 총 {{ isCluster ? article.length : 1 }}건의
          <span class="category-underline">{{ getCategoryText }}</span> 길거리
          괴롭힘이 있었습니다.
        </p>
      </div>

      <!-- Article list -->
      <div class="news-section">
        <h2 class="news-header">관련 뉴스기사 {{ article.length }} 건</h2>
        <div v-if="isCluster">
          <div
            v-for="(item, index) in article"
            :key="index"
            class="news_title"
            @click="openNews(item.url)">
            {{ item.title }}
          </div>
        </div>
        <div v-else class="news_title" @click="openNews(article.url)">
          {{ article.title }}
        </div>
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
} from "vue";
import "../styles/MarkerPopup.scss";

// Define props for the component
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

// Reference to the popup element
const popupRef = ref(null);
const isCluster = computed(() => Array.isArray(props.article));

// Compute the category text based on the articles
const getCategoryText = computed(() => {
  if (isCluster.value) {
    const categories = props.article
      .map((item) => item.category)
      .filter(Boolean); // Get non-empty categories
    const uniqueCategories = [...new Set(categories)]; // Get unique categories

    if (uniqueCategories.length === 0) {
      return "기타"; // All categories are empty
    } else if (uniqueCategories.length === 1) {
      return uniqueCategories[0]; // Only one unique category
    } else {
      return "여러 유형"; // Multiple unique categories
    }
  }
  return props.article.category || "기타"; // Single article case
});

// Open news article in new tab
// This function opens the provided URL in a new browser tab
const openNews = (url) => {
  window.open(url, "_blank");
};

// Handle clicks outside the popup
// This function closes the popup if a click occurs outside of it
const handleClickOutside = (event) => {
  if (popupRef.value && popupRef.value.contains(event.target)) {
    return;
  }
  props.closeWindow();
};

// Add event listener on mount
// This lifecycle hook adds a mousedown event listener to detect clicks outside the popup
onMounted(() => {
  nextTick(() => {
    window.addEventListener("mousedown", handleClickOutside);
  });
});

// Clean up event listener on unmount
// This lifecycle hook removes the mousedown event listener when the component is unmounted
onUnmounted(() => {
  window.removeEventListener("mousedown", handleClickOutside);
});
</script>
