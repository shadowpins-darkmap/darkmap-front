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

    <strong class="detail_title">{{ post.title }}</strong>

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
        <span class="detail_nickname">{{ post.nickname }} </span>
        <span class="detail_count_wrap">
          <span class="detail_count">
            <span class="detail_comment">댓글 {{ post.comments }}</span>
            <span class="detail_likes">좋아요 {{ post.likes }}</span>
            <span class="detail_view">조회수 {{ post.views }}</span>
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
      :height="'400px'"
      direction="vertical"
      gradient-color="rgba(64,64,64,1.5)"
    >
      <!-- 본문 내용 -->
      <div class="detail_content_wrap">
        <p class="detail_content">
          `안녕하세요.동네에 살면서 이런 글을 쓰게 될 줄은 몰랐는데`
        </p>
        <div class="detail_icon_wrap">
          <!-- 좋아요 아이콘 -->
          <button class="detail_icon_button" aria-label="좋아요">
            <img src="@/assets/commentHeartIcon.svg" alt="like" />
            <span class="detail_icon_text"> 이 글을 추천해요 </span>
          </button>
          <!-- 신고 아이콘 -->
          <button class="detail_icon_button" aria-label="신고">
            <img src="@/assets/commentReportIcon.svg" alt="report" />
            <span class="detail_icon_text"> 이 글을 신고하고 싶어요 </span>
          </button>
        </div>
      </div>
      <!-- 댓글 게시 영역 -->
      <div class="comments_list_wrap">
        <ul>
          <li
            v-for="comment in comments"
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
                <button class="icon_button" aria-label="좋아요">
                  <img src="@/assets/commentHeartIcon.svg" alt="like" />
                </button>
                <!-- 댓글 신고 아이콘 -->
                <button class="icon_button" aria-label="신고">
                  <img src="@/assets/commentReportIcon.svg" alt="report" />
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
      </div>
    </GradientScroll>
    <!-- 댓글 등록 영역 -->
    <div class="comment_footer">
      <div class="comment_input_wrap">
        <textarea
          v-model="comment"
          class="comment_textarea"
          placeholder="댓글을 입력해 주세요"
          maxlength="490"
          id="comment_text"
          @input="updateLength"
          @keydown.enter.prevent="handleEnter"
        ></textarea>
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
  <BaseAlertPopup v-if="showPopup" @confirm="showPopup = false">
    <p>댓글이 삭제되었습니다.</p>
  </BaseAlertPopup>
</template>

<script setup>
// emits: close, openDetail
import { ref, defineProps, nextTick } from 'vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';

defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const comment = ref('');
const showPopup = ref(false);

const updateLength = () => {
  if (comment.value.length > 490) {
    comment.value = comment.value.slice(0, 490);
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

const comments = ref([
  {
    id: 1,
    nickname: '정말 무서운 경험이셨겠어요0',
    content: '미친... 저도 비슷한 일 있어서 쓰레기 버릴때마다 긴장해요.',
    updateDate: '2025-05-05',
    updateTime: 'PM 8:00',
    recommendCount: 999,
  },
  {
    id: 2,
    nickname: '붉은핀',
    content: '댓글 테스트',
    updateDate: '2025-05-05',
    updateTime: 'PM 8:00',
    recommendCount: 0,
  },
  {
    id: 3,
    nickname: '붉은핀',
    content:
      '저도 비슷한 경험이 있어서 너무 공감이 됩니다. 밤늦게 집에 들어갈 때마다 괜히 뒤를 한 번 더 돌아보게 되고, 누가 따라오는 건 아닌지 긴장하게 돼요. 그럴 때마다 괜히 핸드폰을 귀에 대고 통화하는 척하거나, 이어폰을 빼고 주변 소리에 더 집중하게 되더라고요. 사실 이런 불안감은 겪어본 사람만 알 수 있는 감정인데, 이렇게 공유해주셔서 감사해요. 저는 한번은 집 앞에서 모르는 사람이 갑자기 말을 걸어서 너무 놀란 적도 있어요. 그런 경험이 쌓이다 보니 외출 자체가 두려워졌고, 밤에는 될 수 있으면 외출을 피하게 되었어요. 혼자 사는 여성분들 정말 조심하셔야 하고, 이런 일은 그냥 넘기지 말고 주변에 알리는 게 중요한 것 같아요. 저도 다음부터는 바로 신고하거나 관리사무소에 알려보려고요. 부디 더 이상 불쾌한 일이 없길 바랍니다.',
    updateDate: '2025-05-05',
    updateTime: 'PM 8:00',
    recommendCount: 9,
  },
  {
    id: 4,
    nickname: '이런 일은 다시 없길 바라요2',
    content:
      '저도 비슷한 경험이 있어서 너무 공감이 됩니다. 밤늦게 집에 들어갈 때마다 괜히 뒤를 한 번 더 돌아보게 되고, 누가 따라오는 건 아닌지 긴장하게 돼요. 그럴 때마다 괜히 핸드폰을 귀에 대고 통화하는 척하거나, 이어폰을 빼고 주변 소리에 더 집중하게 되더라고요. 사실 이런 불안감은 겪어본 사람만 알 수 있는 감정인데, 이렇게 공유해주셔서 감사해요. 저는 한번은 집 앞에서 모르는 사람이 갑자기 말을 걸어서 너무 놀란 적도 있어요. 그런 경험이 쌓이다 보니 외출 자체가 두려워졌고, 밤에는 될 수 있으면 외출을 피하게 되었어요. 혼자 사는 여성분들 정말 조심하셔야 하고, 이런 일은 그냥 넘기지 말고 주변에 알리는 게 중요한 것 같아요. 저도 다음부터는 바로 신고하거나 관리사무소에 알려보려고요. 부디 더 이상 불쾌한 일이 없길 바랍니다.',
    updateDate: '2025-05-05',
    updateTime: 'PM 8:00',
    recommendCount: 9,
  },
]);
// 내 댓글 지우기
const deleteComment = (id) => {
  comments.value = comments.value.filter((c) => c.id !== id);
  showPopup.value = true;
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

/* 댓글 등록 영역  */
.comment_input_wrap {
  background-color: #cfc3d9;
  padding: 15px;
  border-radius: 12px;
  height: 80px;
  border: 2px solid #f1cfc8;
  display: flex;
  flex-direction: column;
}
.comment_textarea {
  background-color: #cfc3d9;
  border: none;
  width: 100%;
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
