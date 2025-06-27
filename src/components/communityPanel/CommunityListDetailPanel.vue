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

      <div class="detail_content_area">
        <div class="detail_top_profile">
          <span class="detail_nickname">{{ post.nickname }} </span>
          <span class="detail_count_wrap">
            <span class="detail_count">
              <span class="detail_comment">댓글 {{ post.comments }}</span>
              <span class="detail_likes">좋아요 {{ post.likes }}</span>
              <span class="detail_view">조회수 {{ post.views }}</span>
            </span>
            <span class="detail_count">
              <span> 2025-05-05 </span>
              <span>PM 8:00</span>
            </span>
          </span>
        </div>
        <!-- 본문 스크롤 영역 -->
        <GradientScroll
          :width="'336px'"
          :height="'400px'"
          direction="vertical"
          gradient-color="rgba(64,64,64,1.5)"
        >
          <p class="detail_content">
            `안녕하세요.동네에 살면서 이런 글을 쓰게 될 줄은 몰랐는데, 요즘 너무
            불안해서 용기 내어 남깁니다. 저는 ○○아파트 사는 30대 직장인
            여성입니다.며칠 전 밤 11시쯤, 집 앞 쓰레기장에 음식물 쓰레기 버리러
            나갔는데같은 단지에 사는 이웃 아저씨 한 분이 계속
            따라오시더라고요.처음엔 우연인가 싶었는데, 제가 집으로 다시 들어갈
            때까지 10미터쯤 떨어져서 따라오셨고엘리베이터 앞에서도 말을 걸며
            번호를 묻는 등 불쾌한 행동을 하셨어요. 그날 이후로 밤에 쓰레기
            버리는 것도 무서워졌고, 몇 번 더 마주쳤는데 계속 힐끔거리며
            쳐다보셔서혹시 저만 겪은 게 아닌가 싶어 이렇게 글 올립니다. 이런
            경우 관리사무소에 먼저 이야기해야 할까요? 아니면 바로 경찰에 말해야
            할지 고민 중이에요.혹시 비슷한 경험 있으시거나 조언 주실 수 있는 분
            계시면 댓글 부탁드립니다.같은 동네에 사는 여성분들 특히 조심하시길
            바라요. 이야기해야 할까요? 아니면 바로 경찰에 말해야 할지 고민
            중이에요.혹시 비슷한 경험 있으시거나 조언 주실 수 있는 분 계시면
            댓글 부탁드립니다.같은 동네에 사는 여성분들 특히 조심하시길 바라요.
            이야기해야 할까요? 아니면 바로 경찰에 말해야 할지 고민 중이에요.혹시
            비슷한 경험 있으시거나 조언 주실 수 있는 분 계시면 댓글
            부탁드립니다.같은 동네에 사는 여성분들 특히 조심하시길 바라요.
            이야기해야 할까요? 아니면 바로 경찰에 말해야 할지 고민 중이에요.혹시
            비슷한 경험 있으시거나 조언 주실 수 있는 분 계시면 댓글
            부탁드립니다.같은 동네에 사는 여성분들 특히 조심하시길 바라요.
            이야기해야 할까요? 아니면 바로 경찰에 말해야 할지 고민 중이에요.혹시
            비슷한 경험 있으시거나 조언 주실 수 있는 분 계시면 댓글
            부탁드립니다.같은 동네에 사는 여성분들 특히 조심하시길 바라요.
            이야기해야 할까요? 아니면 바로 경찰에 말해야 할지 고민 중이에요.혹시
            비슷한 경험 있으시거나 조언 주실 수 있는 분 계시면 댓글
            부탁드립니다.같은 동네에 사는 여성분들 특히 조심하시길 바라요. `
          </p>
        </GradientScroll>
      </div>
    </div>

    <!-- 댓글 영역 -->
    <div class="comment_footer">
      <div class="comment_input_wrap">
        <textarea
          v-model="comment"
          class="comment_textarea"
          placeholder="댓글을 입력해 주세요"
          maxlength="490"
          id="comment_text"
          @input="updateLength"
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
</template>

<script setup>
// emits: close, openDetail
import { ref, defineProps } from 'vue';
import GradientScroll from '@/components/gradientScroll/GradientScroll.vue';

defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const comment = ref('');

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
  padding-top: 20px;
}
.profile_detail_img_box {
  display: flex;
  float: 0 0 auto;
  margin-right: 15px;
}

.detail_top_profile {
  display: flex;
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
  gap: 5px;
}
.detail_content {
  white-space: pre-wrap;
  word-break: keep-all;
  line-height: 1.6;
}

// 댓글 영역
.comment_input_wrap {
  background-color: #f1cfc8;
  padding: 20px;
  border-radius: 12px;
  height: 80px;
}
.comment_textarea {
  background-color: #f1cfc8;
  border: none;
  width: 100%;
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
  color: #000;
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
