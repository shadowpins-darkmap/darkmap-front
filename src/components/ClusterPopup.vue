<template>
  <div class="popup">
    <img @click="closeWindow" class="close" src="../assets/closePopup.svg" />
    <div style="color: #ffefeb">
      이 지역에서 총 { {{ articles.length }} } 건의 길거리 괴롭힘이 있었습니다.
    </div>
    <div
      v-for="(article, i) in articles"
      :key="i"
      class="news_title"
      @click="openNews(i)">
      {{ article.title }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue"
import "@/styles/ClusterPopup.scss"
const props = defineProps({
  closeWindow: {
    type: Function,
    required: true,
  },
  articles: {
    type: Array,
    required: true,
  },
})

const openNews = (idx) => {
  window.open(props.articles[idx].url, "_blank")
}
</script>
