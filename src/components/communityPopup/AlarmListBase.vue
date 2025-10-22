<template>
  <ul class="alarm_list_wrap">
    <li v-for="(item, index) in props.items" :key="item.boardId" class="alarm_list" :class="getListClass(index)">
      <button class="alarm_list_button" @click="handleItemClick(item)">
        <span class="alarm_list_icon">
          <img v-if="props.currentTab == '알림'" :src="getIcon(item.type)" alt="alarm list icon" width="24" height="24" />
          <img v-else src="@/assets/profileDefault.svg" alt="profile icon" width="40" height="40" />
        </span>
        <span class="ellipsis__2 alarm_contents">
          {{
            props.currentTab === '알림'
              ? item.type === 'comment'
                ? `${item.nickname}님이 "${item.title}"글에 "${item.content}" 댓글을 남겼습니다.`
                : item.type === 'like'
                  ? `${item.nickname}님이 "${item.title}"글을 추천했습니다.`
                  : `${item.nickname}님이 제보하신 ${item.title}의 사건이 다크플레이스로 등록되었습니다.`
              : props.currentTab === '내 게시글'
                ? item.title
                : item.content
          }}
        </span>
      </button>
    </li>
  </ul>

  <BaseAlertPopup v-if="showMoveToPostAlert" @cancel="handleCancelMoveToPost" @confirm="handleMoveToPost"
    :showTwoButtons="true" cancelText="아니요" confirmText="보러 가기">
    <p>해당 글의 페이지로 이동할까요?</p>
  </BaseAlertPopup>
  <SlidePanel :width="'510px'" :visible="isArticleDetailOpen" @close="isArticleDetailOpen = false">
    <CommunityListDetailPanel :post="selectedArticle" @close="handleListPanelClose"
      @openDetail="isArticleDetailOpen = true" />
  </SlidePanel>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { boardsApi } from '@/api/boards';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';
import iconComment from '@/assets/alarmComment.svg';
import iconLike from '@/assets/alarmLike.svg';
import iconMarker from '@/assets/alarmMarker.svg';
import CommunityListDetailPanel from '@/components/communityPanel/CommunityListDetailPanel.vue';

const props = defineProps({
  currentTab: String,
  items: Array,
  currentPage: Number,
  itemsPerPage: Number,
});

const getIcon = (tag) => {
  switch (tag) {
    case 'comment':
      return iconComment;
    case 'like':
      return iconLike;
    case 'place':
      return iconMarker;
    default:
      return iconComment;
  }
};

const showMoveToPostAlert = ref(false);
const selectedArticle = ref(null);
const isArticleDetailOpen = ref(false);

const getListClass = (index) => {
  const globalIndex = (props.currentPage - 1) * props.itemsPerPage + index;
  if (props.currentPage === 1) {
    if (globalIndex === 0) return 'color_1';
    if (globalIndex === 1) return 'color_2';
    if (globalIndex === 2) return 'color_3';
  }
  return '';
};

const handleItemClick = (item) => {
  selectedArticle.value = item;
  showMoveToPostAlert.value = true;
};

const handleMoveToPost = async () => {
  try {
    let boardId;
    if (props.currentTab === '내 댓글') {
      boardId = selectedArticle.value.board.boardId;
    } else if (props.currentTab === '알림') {
      boardId = selectedArticle.value.boardId;
    } else {
      boardId = selectedArticle.value.boardId;
    }

    const response = await boardsApi.getBoardById(boardId);
    const article = response.data;
    selectedArticle.value = article;
    showMoveToPostAlert.value = false;
    isArticleDetailOpen.value = true;
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    showMoveToPostAlert.value = false;
  }
};

const handleCancelMoveToPost = () => {
  showMoveToPostAlert.value = false;
  selectedArticle.value = null;
};

const handleListPanelClose = () => {
  isArticleDetailOpen.value = false;
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
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: space-between;
  padding: 15px;
  border-radius: 6px;
  background-color: #4c3d86;
  border: none;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
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
