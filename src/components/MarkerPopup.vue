<template>
  <div class="popup">
    <img @click="closeWindow" class="close" src="../assets/closePopup.svg">
    <div class="news_title" @click="openNews">{{ article.title }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  closeWindow: {
    type: Function,
    required: true,
  },
  article: {
    type: Object,
    required: true,
  }
})

const openNews = () => {
  window.open(props.article.url, '_blank')
}
</script>

<style scoped lang="scss">
.close {
  width: 18px;
  height: 18px;
  float: right;
  &:hover {
    cursor: pointer;
  }
}
.news_title {
  color: #FFEFEB;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
.popup {
  position: relative;
  width: 400px;
  height: 280px;
  box-shadow: 0 0 0 1px #4E5277;
  background-color: #313457;
  border-radius: 2px;
  z-index: 2;
  pointer-events: all;
  box-sizing: border-box;
  padding: 18px;
}

.popup:after {
  content: '';
  position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 0;
	border: 37px solid transparent;
	border-top-color: #313457;
	border-bottom: 0;
	border-left: 0;
	margin-left: -18.5px;
	margin-bottom: -36px;
  z-index: 3;
}

.popup:before {
  content: '';
  position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 0;
	border: 38px solid transparent;
	border-top-color: #4E5277;
	border-bottom: 0;
	border-left: 0;
	margin-left: -19.5px;
	margin-bottom: -38px;
  z-index: 2;
}
</style>