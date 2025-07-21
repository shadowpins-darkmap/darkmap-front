<template>
  <div class="slider_detail_wrap">
    <button class="slider_colse_button" @click="$emit('close')">
      <img
        src="@/assets/detailCloseArrow.svg"
        alt="slider close icon"
        width="36"
        height="36"
      />
    </button>

    <strong class="detail_title">{{ props.post.title }}</strong>

    <div class="profile_img_wrap">
      <div class="profile_detail_img_box">
        <img
          src="@/assets/profileDefault.svg"
          alt="profile default image"
          width="80"
          height="80"
        />
      </div>

      <div class="detail_top_profile">
        <span class="detail_nickname">{{ props.post.nickname }} </span>
        <span class="detail_count_wrap">
          <span class="detail_count">
            <span class="detail_comment">댓글 {{ props.post.comments }}</span>
            <span class="detail_likes">좋아요 {{ props.post.likes }}</span>
            <span class="detail_view">조회수 {{ props.post.views }}</span>
          </span>
          <span class="detail_count">
            <span>PM 8:00</span>
            <span> 2025-05-05 </span>
          </span>
        </span>
      </div>
    </div>
    <!-- 본문 스크롤 영역 -->
    <GradientScroll
      :width="'100%'"
      :height="'calc(100% - 400px)'"
      direction="vertical"
      gradient-color="rgba(64,64,64,1.5)"
    >
      <div class="detail_scroll_wrap">
        <!-- 본문 내용 -->
        <div class="detail_content_wrap">
          <p class="detail_content">
            안녕하세요.동네에 살면서 이런 글을 쓰게 될 줄은 몰랐는데
            안녕하세요.동네에 살면서 이런 글을 쓰게 될 줄은 몰랐는데 안녕하세요
          </p>
          <div class="detail_icon_wrap">
            <!-- 좋아요 아이콘 -->
            <button
              class="detail_icon_button"
              aria-label="좋아요"
              @click="togglePostLike"
            >
              <img
                :src="
                  isPostLiked
                    ? require('@/assets/commentHeartIconOn.svg')
                    : require('@/assets/commentHeartIconOff.svg')
                "
                alt="like"
              />
              <span class="detail_icon_text"> 이 글을 추천해요 </span>
            </button>
            <!-- 신고 아이콘 -->
            <button
              class="detail_icon_button"
              aria-label="신고"
              @click="openReportPopup('post', props.post.id)"
            >
              <img
                :src="
                  isPostReport
                    ? require('@/assets/commentReportIconOn.svg')
                    : require('@/assets/commentReportIconOff.svg')
                "
                alt="report"
              />
              <span class="detail_icon_text"> 이 글을 신고하고 싶어요 </span>
            </button>
          </div>
        </div>
        <!-- 댓글 게시 영역 -->
        <div class="comments_list_wrap">
          <ul>
            <li
              v-for="comment in paginatedComments"
              :key="comment.id"
              class="comments_item"
            >
              <div class="comment_profile">
                <img
                  src="@/assets/profileDefault.svg"
                  alt="profile"
                  width="40"
                  height="40"
                />
                <span class="comment_nickname">{{ comment.nickname }}</span>
              </div>
              <!-- 댓글 내용 영역 -->
              <div class="comment_bubble_wrap">
                <span class="comment_data_wrap">
                  <span class="comment_data">{{ comment.updateDate }}</span>
                  <span class="comment_data">{{ comment.updateTime }}</span>
                  <span class="comment_data"
                    >추천 {{ comment.recommendCount }}</span
                  >
                </span>
                <span class="comment_bubble">
                  <p class="comment_content">{{ comment.content }}</p>
                </span>
                <span class="comment_icons">
                  <!-- 댓글 좋아요 아이콘 -->
                  <button
                    class="icon_button"
                    aria-label="좋아요"
                    @click="toggleLike(comment.id)"
                  >
                    <img
                      :src="
                        likedComments.has(comment.id)
                          ? require('@/assets/commentHeartIconOn.svg')
                          : require('@/assets/commentHeartIconOff.svg')
                      "
                      alt="like"
                    />
                  </button>
                  <!-- 댓글 신고 아이콘 -->
                  <button
                    class="icon_button"
                    aria-label="신고"
                    @click="openReportPopup('comment', comment.id)"
                  >
                    <img
                      :src="
                        reportedComments.has(comment.id)
                          ? require('@/assets/commentReportIconOn.svg')
                          : require('@/assets/commentReportIconOff.svg')
                      "
                      alt="report"
                    />
                  </button>
                  <!-- 내가 쓴 댓글이면 삭제 아이콘 표시 -->
                  <button
                    v-if="comment.nickname === myNickname"
                    class="icon_button"
                    aria-label="삭제"
                    @click="deleteComment(comment.id)"
                  >
                    <img src="@/assets/commentDeleteIcon.svg" alt="delete" />
                  </button>
                </span>
              </div>
            </li>
          </ul>
          <div
            v-if="comments.length > commentsPerPage"
            class="comment_pagination_wrap"
          >
            <PaginationWrap
              v-if="comments.length > commentsPerPage"
              :currentPage="commentsPage"
              :pageNumbers="
                Array.from({ length: commentsTotalPages }, (_, i) => i + 1)
              "
              @page-change="changeCommentPage"
            />
          </div>
        </div>
      </div>
    </GradientScroll>
    <!-- 댓글 등록 영역 -->
    <div class="comment_footer">
      <div
        class="comment_input_wrap"
        :style="{ height: commentInputHeight + 48 + 'px' }"
      >
        <GradientScroll
          :width="'100%'"
          :height="parseInt(commentInputHeight) >= 80 ? 'auto' : '80px'"
          direction="vertical"
          gradient-color="rgb(207, 195, 217,1.5)"
          :show-gradient="parseInt(commentInputHeight) >= 80"
        >
          <textarea
            v-model="comment"
            class="comment_textarea"
            placeholder="댓글을 입력해 주세요"
            maxlength="490"
            id="comment_text"
            @input="updateLength"
            @keydown.enter.prevent="handleEnter"
            rows="1"
          ></textarea>
        </GradientScroll>

        <span class="char_count">{{ comment.length }}/490</span>
      </div>
      <button class="comment_submit_button" @click="submitComment">
        댓글 쓰기
      </button>
    </div>
    <!-- 이전글 다음글 이동 버튼  -->
    <!-- <div class="move_button_wrap">
      <div class="move_button_box">
        <button class="move_button">
          <img
            src="@/assets/detailArrowPrev.svg"
            class="button_arrow_icon"
            alt="button arrow icon"
            width="16"
            height="16"
          />
        </button>
        <span class="move_button_text">이전글</span>
      </div>
      <div class="move_button_box">
        <button class="move_button">
          <img
            src="@/assets/detailArrowNext.svg"
            class="button_arrow_icon"
            alt="button arrow icon"
            width="16"
            height="16"
          />
        </button>
        <span class="move_button_text">다음글</span>
      </div>
    </div> -->
  </div>

  <!-- 팝업  -->
  <BaseAlertPopup v-if="showDeletePopup" @confirm="showDeletePopup = false">
    <p>댓글이 삭제되었습니다.</p>
  </BaseAlertPopup>
  <BaseAlertPopup v-if="showLikePopup" @confirm="showLikePopup = false">
    <p>{{ `snrn` }}님의 댓글을 추천했습니다!</p>
  </BaseAlertPopup>
  <BaseAlertPopup v-if="showCommentPopup" @confirm="showCommentPopup = false">
    <p>댓글이 등록되었습니다.</p>
  </BaseAlertPopup>
  <BaseAlertPopup
    v-if="showReportSuccesePopup"
    title="신고를 완료했습니다."
    @confirm="showReportSuccesePopup = false"
  >
    <p>
      사이트 운영진의 검토가 끝나면<br />등록하신 이메일로 관련 조치를
      알려드려요<br />해당 안내는 3~14일정도 소요될 수 있습니다.
    </p>
  </BaseAlertPopup>
  <CommonPopup :visible="showReportPopup" @close="showReportPopup = false">
    <CommunityPostReportForm
      :type="reportTarget.type"
      :id="reportTarget.id"
      @report-complete="onReportComplete"
    />
  </CommonPopup>
</template>

<script setup>
// emits: close, openDetail
import { ref, defineProps, nextTick, computed } from 'vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';
import CommonPopup from '@/components/commonPopup/CommonPopup.vue';
import CommunityPostReportForm from '@/components/communityPopup/CommunityPostReportForm.vue';
import PaginationWrap from '@/components/pagination/PaginationWrap.vue';

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const comment = ref('');
const showDeletePopup = ref(false);
const showLikePopup = ref(false);
const showCommentPopup = ref(false);
const showReportSuccesePopup = ref(false);

const showReportPopup = ref(false);
const reportTarget = ref({ type: '', id: null });
// 게시글 신고
const isPostReport = ref(props.post.userReport ?? false);
const reportedComments = ref(new Set());

const openReportPopup = (type, id) => {
  // type : "post" || "comment"
  reportTarget.value = { type, id };
  showReportPopup.value = true;
};
const onReportComplete = (type, id) => {
  showReportPopup.value = false;
  showReportSuccesePopup.value = true;

  if (type === 'post') {
    isPostReport.value = true;
  } else if (type === 'comment') {
    reportedComments.value.add(id);
  }
};

// 게시글 좋아요
const isPostLiked = ref(props.post.userLiked ?? false);

const togglePostLike = () => {
  isPostLiked.value = !isPostLiked.value;

  // TODO: 서버에 좋아요/취소 요청 보내기
  // 예시:
  // if (isPostLiked.value) {
  //   await api.likePost(post.id);
  // } else {
  //   await api.unlikePost(post.id);
  // }

  showLikePopup.value = true;
};

const commentInputHeight = ref(20);

const updateLength = () => {
  if (comment.value.length > 490) {
    comment.value = comment.value.slice(0, 490);
  }

  // 텍스트 입력시 동적 높이 조절
  const textarea = document.getElementById('comment_text');
  if (textarea) {
    textarea.style.height = 'auto';
    const scrollH = textarea.scrollHeight;
    const maxH = 145;
    commentInputHeight.value = Math.min(scrollH, maxH);
    textarea.style.height = commentInputHeight.value + 'px';
  }
};

const submitComment = () => {
  if (!comment.value.trim()) return;
  // TODO: API 호출 또는 emit
  console.log('댓글 등록:', comment.value);
  comment.value = '';
};

const handleEnter = (e) => {
  if (e.shiftKey) {
    // 쉬프트 + 엔터: 줄바꿈
    const pos = e.target.selectionStart;
    comment.value =
      comment.value.slice(0, pos) + '\n' + comment.value.slice(pos);
    nextTick(() => {
      e.target.selectionStart = e.target.selectionEnd = pos + 1;
    });
  } else {
    submitComment();
  }
};

// 댓슬 리스트
// 더미 데이터 TODO
const myNickname = '붉은핀';

const comments = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    nickname: `붉은 핀의 아이디 ${i + 1}`,
    content: `This is a dummy comment number ${i + 1}.`,
    updateDate: '2025-05-05',
    updateTime: 'PM 8:00',
    recommendCount: i * 2,
  })),
);

// 댓글 페이지네이션
const commentsPerPage = 10;
const commentsPage = ref(1);

const paginatedComments = computed(() => {
  const start = (commentsPage.value - 1) * commentsPerPage;
  return comments.value.slice(start, start + commentsPerPage);
});

const commentsTotalPages = computed(() =>
  Math.ceil(comments.value.length / commentsPerPage),
);

const changeCommentPage = (page) => {
  commentsPage.value = page;
};

// 내 댓글 지우기
const deleteComment = (id) => {
  comments.value = comments.value.filter((c) => c.id !== id);
  showDeletePopup.value = true;
};

// 각 댓글의 좋아요 상태를 저장할 Map
const likedComments = ref(new Set());
const toggleLike = (commentId) => {
  if (likedComments.value.has(commentId)) {
    // 좋아요 취소 요청 (선택사항)
    likedComments.value.delete(commentId);
    // TODO: 서버에 좋아요 취소 요청 API 호출
  } else {
    likedComments.value.add(commentId);
    // TODO: 서버에 좋아요 등록 요청 API 호출
    showLikePopup.value = true;
  }
};
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
  word-break: keep-all;
  line-height: 1.6;
}
.detail_icon_wrap {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}
.detail_icon_button {
}
.detail_icon_text {
  font-size: 10px;
  color: #00ffc2;
}

/* 댓글 게시 영역 */
.comments_list_wrap {
  border-top: 1px solid #fff;
  padding: 20px 0;
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
.icon_button {
}
.comment_pagination_wrap {
  border-top: 1px solid #fff;
  margin-top: 20px;
}
/* 댓글 등록 영역  */
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

// 좌우 슬라이더
.move_button_wrap {
  margin-top: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.move_button_box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.move_button_text {
  font-size: 18px;
  font-weight: bold;
}
.move_button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 54px;
  background-color: #535252;
}
</style>
