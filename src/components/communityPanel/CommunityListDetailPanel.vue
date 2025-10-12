<template>
  <div class="slider_detail_wrap">
    <button class="slider_colse_button" @click="$emit('close')">
      <img src="@/assets/detailCloseArrow.svg" alt="slider close icon" width="36" height="36" />
    </button>
    <strong class="detail_title">{{ props.post?.title }}</strong>

    <div class="profile_img_wrap">
      <div class="profile_detail_img_box">
        <img src="@/assets/profileDefault.svg" alt="profile default image" width="80" height="80" />
      </div>

      <div class="detail_top_profile">
        <span class="detail_nickname">{{ props.post?.authorNickname }} </span>
        <span class="detail_count_wrap">
          <span class="detail_count">
            <span class="detail_comment">댓글 {{ props.post?.commentCount }}</span>
            <span class="detail_likes">좋아요 {{ props.post?.likeCount }}</span>
            <span class="detail_view">조회수 {{ props.post?.viewCount }}</span>
          </span>
          <span class="detail_count">
            <span>{{ formatTime(props.post?.createdAt) }}</span>
            <span>{{ formatDate(props.post?.createdAt) }}</span>
          </span>
        </span>
      </div>
    </div>

    <GradientScroll :width="'100%'" :height="'calc(100% - 400px)'" direction="vertical"
      gradient-color="rgba(64,64,64,1.5)">
      <div class="detail_scroll_wrap">
        <div class="detail_content_wrap">
          <p class="detail_content">{{ props.post?.content || '내용이 없습니다.' }}</p>
          <div class="detail_icon_wrap">
            <button class="detail_icon_button" @click="handleBoardLike">
              <img
                :src="isPostLiked ? require('@/assets/commentHeartIconOn.svg') : require('@/assets/commentHeartIconOff.svg')"
                alt="like" />
              <span class="detail_icon_text">이 글을 추천해요</span>
            </button>
            <button class="detail_icon_button" @click="openReportPopup('post', props.post?.boardId)">
              <img
                :src="isPostReport ? require('@/assets/commentReportIconOn.svg') : require('@/assets/commentReportIconOff.svg')"
                alt="report" />
              <span class="detail_icon_text">이 글을 신고하고 싶어요</span>
            </button>
          </div>
        </div>

        <div class="comments_list_wrap">
          <ul>
            <li v-for="comment in paginatedComments" :key="comment.commentId" class="comments_item">
              <div class="comment_profile">
                <img src="@/assets/profileDefault.svg" alt="profile" width="40" height="40" />
                <span class="comment_nickname">{{ comment.authorNickname }}</span>
              </div>
              <div class="comment_bubble_wrap">
                <span class="comment_data_wrap">
                  <span class="comment_data">{{ formatDate(comment.createdAt) }}</span>
                  <span class="comment_data">{{ formatTime(comment.createdAt) }}</span>
                  <span class="comment_data">추천 {{ comment.likes || 0 }}</span>
                </span>
                <span class="comment_bubble">
                  <p class="comment_content">{{ comment.content }}</p>
                </span>
                <span class="comment_icons">
                  <button class="icon_button" @click="handleCommentLike(comment.commentId)">
                    <img
                      :src="likedComments.has(comment.commentId) ? require('@/assets/commentHeartIconOn.svg') : require('@/assets/commentHeartIconOff.svg')"
                      alt="like" />
                  </button>
                  <button class="icon_button" @click="openReportPopup('comment', comment.commentId)">
                    <img
                      :src="reportedComments.has(comment.commentId) ? require('@/assets/commentReportIconOn.svg') : require('@/assets/commentReportIconOff.svg')"
                      alt="report" />
                  </button>
                  <button v-if="comment.authorNickname === auth.nickname" class="icon_button"
                    @click="handleDeleteComment(comment.commentId)">
                    <img src="@/assets/commentDeleteIcon.svg" alt="delete" />
                  </button>
                </span>
              </div>
            </li>
          </ul>
          <div v-if="comments.length > commentsPerPage" class="comment_pagination_wrap">
            <PaginationWrap :currentPage="commentsPage"
              :pageNumbers="Array.from({ length: commentsTotalPages }, (_, i) => i + 1)"
              @page-change="changeCommentPage" />
          </div>
        </div>
      </div>
    </GradientScroll>

    <div class="comment_footer">
      <div class="comment_input_wrap" :style="{ height: commentInputHeight + 48 + 'px' }">
        <GradientScroll :width="'100%'" :height="parseInt(commentInputHeight) >= 80 ? 'auto' : '80px'"
          direction="vertical" gradient-color="rgb(207, 195, 217,1.5)"
          :show-gradient="parseInt(commentInputHeight) >= 80">
          <textarea v-model="comment" class="comment_textarea" placeholder="댓글을 입력해 주세요" maxlength="490"
            id="comment_text" @input="updateLength" @keydown.enter.prevent="handleEnter" rows="1"></textarea>
        </GradientScroll>
        <span class="char_count">{{ comment.length }}/490</span>
      </div>
      <button class="comment_submit_button" @click="submitComment">댓글 쓰기</button>
    </div>
  </div>

  <BaseAlertPopup v-if="showDeletePopup" @confirm="showDeletePopup = false">
    <p>댓글이 삭제되었습니다.</p>
  </BaseAlertPopup>
  <BaseAlertPopup v-if="showLikePopup" @confirm="showLikePopup = false">
    <p>댓글을 추천했습니다!</p>
  </BaseAlertPopup>
  <BaseAlertPopup v-if="showCommentPopup" @confirm="showCommentPopup = false">
    <p>댓글이 등록되었습니다.</p>
  </BaseAlertPopup>
  <BaseAlertPopup v-if="showReportSuccesePopup" title="신고를 완료했습니다." @confirm="showReportSuccesePopup = false">
    <p>사이트 운영진의 검토가 끝나면<br />등록하신 이메일로 관련 조치를 알려드려요<br />해당 안내는 3~14일정도 소요될 수 있습니다.</p>
  </BaseAlertPopup>
  <BaseAlertPopup v-if="showSelfLikePopup" @confirm="showSelfLikePopup = false">
    <p>본인의 댓글에 좋아요를 누를 수 없습니다.</p>
  </BaseAlertPopup>
  <BaseAlertPopup v-if="showCommentLoadErrorPopup" @confirm="showCommentLoadErrorPopup = false">
    <p>댓글 불러오기에 실패했습니다.<br />다시 시도해주세요.</p>
  </BaseAlertPopup>
  <CommonPopup :visible="showReportPopup" @close="showReportPopup = false">
    <CommunityPostReportForm :type="reportTarget.type" :id="reportTarget.id" @report-complete="onReportComplete" />
  </CommonPopup>
</template>

<script setup>
import { ref, defineProps, defineEmits, nextTick, computed } from 'vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import CommonPopup from '@/components/commonPopup/CommonPopup.vue';
import CommunityPostReportForm from '@/components/communityPopup/CommunityPostReportForm.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';
import { boardsApi } from '@/api/boards';
import { createComment, getCommentsByBoardId, likeComment, deleteComment } from '@/api/comments';
import { useAuthStore } from '@/store/useAuthStore';

defineEmits(['close']);

const props = defineProps({
  post: { type: Object, required: true },
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\./g, '-').replace(/-$/, '');
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const comment = ref('');
const showDeletePopup = ref(false);
const showLikePopup = ref(false);
const showCommentPopup = ref(false);
const showReportSuccesePopup = ref(false);
const showReportPopup = ref(false);
const showSelfLikePopup = ref(false);
const showCommentLoadErrorPopup = ref(false);
const reportTarget = ref({ type: '', id: null });
const isPostReport = ref(props.post?.reportedStatus ?? false);
const reportedComments = ref(new Set());
const isPostLiked = ref(props.post?.isLiked ?? false);
const commentInputHeight = ref(20);
const comments = ref([]);
const commentsPerPage = 10;
const commentsPage = ref(1);
const likedComments = ref(new Set());
const auth = useAuthStore();

const openReportPopup = (type, id) => {
  reportTarget.value = { type, id };
  showReportPopup.value = true;
};

const onReportComplete = (type, id) => {
  showReportPopup.value = false;
  showReportSuccesePopup.value = true;
  if (type === 'post') isPostReport.value = true;
  else if (type === 'comment') reportedComments.value.add(id);
};

const handleBoardLike = async () => {
  try {
    const response = await boardsApi.likeBoard(props.post?.boardId);
    if (response?.data) {
      isPostLiked.value = response.data.isLiked;
      showLikePopup.value = true;
    }
  } catch (error) {
    console.error('게시글 좋아요 실패:', error);
  }
};

const handleCommentLike = async (commentId) => {
  try {
    const response = await likeComment(commentId);
    if (response?.data) {
      const { isLiked, likeCount } = response.data;
      const comment = comments.value.find(c => c.id === commentId);
      if (comment) {
        comment.likes = likeCount;
        comment.isLiked = isLiked;
      }
      if (isLiked) {
        likedComments.value.add(commentId);
        showLikePopup.value = true;
      } else {
        likedComments.value.delete(commentId);
      }
    }
  } catch (error) {
    if (error.response?.status === 403) {
      showSelfLikePopup.value = true;
    }
  }
};

// 댓글 입력
const updateLength = () => {
  if (comment.value.length > 490) comment.value = comment.value.slice(0, 490);
  const textarea = document.getElementById('comment_text');
  if (textarea) {
    textarea.style.height = 'auto';
    const scrollH = textarea.scrollHeight;
    const maxH = 145;
    commentInputHeight.value = Math.min(scrollH, maxH);
    textarea.style.height = commentInputHeight.value + 'px';
  }
};

const handleEnter = (e) => {
  if (e.shiftKey) {
    const pos = e.target.selectionStart;
    comment.value = comment.value.slice(0, pos) + '\n' + comment.value.slice(pos);
    nextTick(() => {
      e.target.selectionStart = e.target.selectionEnd = pos + 1;
    });
  } else {
    submitComment();
  }
};

const loadComments = async () => {
  if (!props.post?.boardId) return;
  try {
    const response = await getCommentsByBoardId(props.post.boardId);
    if (response?.data) {
      comments.value = response.data;
    }
  } catch (error) {
    console.error('댓글 목록 로드 실패:', error);
    showCommentLoadErrorPopup.value = true;
  }
};

const submitComment = async () => {
  if (!comment.value.trim()) return;
  try {
    const response = await createComment(props.post?.boardId, comment.value);
    if (response) {
      showCommentPopup.value = true;
      comment.value = '';
      await loadComments();
    }
  } catch (error) {
    console.error('댓글 등록 실패:', error);
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    await deleteComment(commentId);
    await loadComments();
    showDeletePopup.value = true;
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
  }
};

const paginatedComments = computed(() => {
  const start = (commentsPage.value - 1) * commentsPerPage;
  return comments.value.slice(start, start + commentsPerPage);
});
const commentsTotalPages = computed(() => Math.ceil(comments.value.length / commentsPerPage));

const changeCommentPage = (page) => {
  commentsPage.value = page;
};

loadComments();
</script>

<style scoped lang="scss">
.slider_detail_wrap {
  background-color: #404040;
  padding: 40px 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.slider_colse_button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.detail_title {
  font-weight: bold;
  font-size: 32px;
  line-height: 1.2;
  display: flex;
  padding-top: 40px;
}

.profile_img_wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 20px;
}

.profile_detail_img_box {
  display: flex;
  float: 0 0 auto;
  margin-right: 15px;
}

.detail_top_profile {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
}

.detail_nickname {
  font-size: 24px;
  font-weight: bold;
  color: #a190df;
  display: flex;
  align-items: center;
  line-height: 1.5;
  max-width: 196px;
}

.detail_content_wrap {
  padding-left: 95px;
}

.detail_count_wrap {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
  color: #fff;
}

.detail_count {
  display: flex;
  flex-direction: row-reverse;
  gap: 5px;
}

.detail_content {
  white-space: pre-wrap;
  word-break: break-word;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.6;
}

.detail_icon_wrap {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.detail_icon_text {
  font-size: 10px;
  color: #00ffc2;
}

.comments_list_wrap {
  border-top: 1px solid #fff;
  padding: 20px 0;
  margin-bottom: 60px;
}

.comments_list_wrap ul {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comments_item {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  position: relative;
}

.comment_profile {
  display: flex;
  width: 100px;
  flex-wrap: nowrap;
}

.comment_nickname {
  font-size: 12px;
  color: #bdb2e9;
  word-break: break-word;
  margin-left: 8px;
}

.comment_bubble_wrap {
  width: calc(100% - 110px);
  display: flex;
  flex-direction: column;
}

.comment_data_wrap {
  display: flex;
  align-self: flex-end;
  gap: 5px;
  position: absolute;
  right: 3px;
  top: -5px;
}

.comment_data {
  color: #9886dc;
  font-size: 12px;
}

.comment_bubble {
  background-color: #292929;
  border-radius: 6px;
  padding: 20px;
}

.comment_content {
  line-height: 1.4;
  font-size: 14px;
}

.comment_icons {
  display: flex;
  align-self: flex-end;
  gap: 10px;
  padding-top: 10px;
}

.comment_pagination_wrap {
  border-top: 1px solid #fff;
  margin-top: 20px;
}

.comment_input_wrap {
  background-color: #cfc3d9;
  padding: 15px;
  border-radius: 12px;
  min-height: 80px;
  max-height: 145px;
  border: 2px solid #f1cfc8;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.comment_textarea {
  background-color: #cfc3d9;
  border: none;
  width: 100%;
  display: flex;
  line-height: 1.2;
  padding-top: 4px;
}

.comment_textarea::placeholder {
  color: #735bcf;
}

.comment_footer {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 40px;
  width: calc(100% - 60px);
  background-color: #404040;
  z-index: 100;
}

.char_count {
  font-size: 14px;
  color: #735bcf;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.comment_submit_button {
  width: 138px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  border: 2px solid #f1cfc8;
  border-radius: 42px;
  margin-top: 15px;
  align-self: flex-end;
}
</style>