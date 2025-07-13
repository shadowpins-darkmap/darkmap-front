<template>
  <ul class="alarm_list_wrap">
    <li
      v-for="(item, index) in props.items"
      :key="item.id"
      class="alarm_list"
      :class="getListClass(index)"
    >
      <button class="alarm_list_button">
        <span class="alarm_list_icon">
          <img
            v-if="props.currentTab == '알림'"
            :src="getIcon(item.tag)"
            alt="alarm list icon"
            width="24"
            height="24"
          />
          <img
            v-else
            src="@/assets/profileDefault.svg"
            alt="profile icon"
            width="40"
            height="40"
          />
        </span>
        <span class="ellipsis__2 alarm_contents">
          {{
            props.currentTab === '알림'
              ? `${item.nickname}님이 ${item.tag} '${item.title}'을(를) 남겼습니다.`
              : props.currentTab === '내 게시글'
                ? item.title
                : item.comment
          }}
        </span>
      </button>
    </li>
  </ul>
</template>

<script setup>
import iconComment from '@/assets/alarmComment.svg';
import iconLike from '@/assets/alarmLike.svg';
import iconMarker from '@/assets/alarmMarker.svg';

import { defineProps } from 'vue';
const props = defineProps({
  currentTab: String,
  items: Array,
  currentPage: Number,
  itemsPerPage: Number,
});

const getIcon = (tag) => {
  switch (tag) {
    case '댓글':
      return iconComment;
    case '좋아요':
      return iconLike;
    case '등록':
      return iconMarker;
    default:
      return iconComment;
  }
};

const getListClass = (index) => {
  const globalIndex = (props.currentPage - 1) * props.itemsPerPage + index;
  if (props.currentPage === 1) {
    if (globalIndex === 0) return 'color_1';
    if (globalIndex === 1) return 'color_2';
    if (globalIndex === 2) return 'color_3';
  }
  return '';
};
</script>

<style scoped>
.alarm_list_wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 50px;
}

.alarm_list_button {
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: space-between;
  padding: 15px;
  border-radius: 6px;
  background-color: #4c3d86;
}

.color_1 .alarm_list_button {
  background-color: #9886dc !important;
}
.color_2 .alarm_list_button {
  background-color: #8975d7;
}
.color_3 .alarm_list_button {
  background-color: #7e68d4;
}

.alarm_list_icon {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  background-color: #d2cbf0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alarm_contents {
  display: flex;
  width: calc(100% - 50px);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
</style>
