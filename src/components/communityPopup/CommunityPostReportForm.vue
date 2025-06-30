<template>
  <div class="form_wrap">
    <!-- 신고 유형 선택 단계 -->
    <div v-if="step === 1" class="report_step_box">
      <strong class="form_title">신고의 유형을 먼저 선택해주세요</strong>
      <ul class="report_type_list">
        <li>
          <button
            v-for="(type, index) in reportTypes"
            :key="index"
            :class="{ selected: selectedType === type.value }"
            @click="selectType(type.value)"
          >
            <strong>{{ type.title }}</strong>
            <p>{{ type.desc }}</p>
          </button>
        </li>
      </ul>
    </div>

    <!-- 상세 작성 단계 -->
    <div v-else-if="step === 2" class="report_step_box">
      <strong class="form_title">신고내용을 작성해주세요</strong>

      <BaseTextarea
        v-model="description"
        placeholder="자신이 알고있거나 직간접적으로 경험한 사건의 경위 내용을 간략히 설명해주세요."
        :id="write_contents"
        :height="'300px'"
      />
      <BaseInput
        v-model="image"
        type="file"
        label="이미지"
        :id="'write_image'"
        :accept="'image/png, image/jpeg, image/gif'"
        :onChange="handleImage"
      />
    </div>
    <!-- TODO : link -->
    <a href="#" target="_blank" class="go_guid_link"
      >커뮤니티 가이드 보러가기 LINK</a
    >
    <button
      v-if="step === 1"
      class="submit_button"
      :disabled="!selectedType"
      @click="step = 2"
    >
      다음
    </button>

    <button
      v-else
      class="submit_button"
      :disabled="!selectedType || !description || !imageFile"
      @click="submitReport"
    >
      제보
    </button>
  </div>

  <BaseAlertPopup
    v-if="showPopup"
    title="제보를 완료했습니다."
    @confirm="showPopup = false"
  >
    <p>
      사이트 운영진의 검토후 장소가 등록되면<br />등록하신 이메일로 알려드려요
    </p>
  </BaseAlertPopup>
</template>

<script setup>
import { ref } from 'vue';
import BaseInput from '@/components/communityPopup/BaseInput.vue';
import BaseTextarea from '@/components/communityPopup/BaseTextarea.vue';
import BaseAlertPopup from '@/components/BaseAlert.vue';

const step = ref(1);
const selectedType = ref('');
const description = ref('');
const imageFile = ref(null);
const previewUrl = ref('');

const reportTypes = [
  {
    value: 'abuse',
    title: '타 회원에 대한 괴롭힘',
    desc: '성적 혹은 인격적인 괴롭힘이 발생했어요',
  },
  {
    value: 'board_misuse',
    title: '커뮤니티 게시판 오사용',
    desc: '비정상적인 방법으로 글이나 댓글을 쓰고 있어요',
  },
  {
    value: 'harmful_upload',
    title: '유해 콘텐츠 업로드',
    desc: '폭력성 정보, 성적행위 등 유해 콘텐츠를 올렸어요',
  },
  {
    value: 'crime',
    title: '범죄 및 범죄 모의행위',
    desc: '커뮤니티를 통해 범죄 행위를 확산하고 있어요',
  },
  {
    value: 'etc',
    title: '기타',
    desc: '정확한 유형을 모르겠다면 기타를 선택해주세요',
  },
];

const selectType = (value) => {
  selectedType.value = value;
};

const handleImage = (event) => {
  const file = event.target.files[0];
  if (file && file.size < 10 * 1024 * 1024) {
    imageFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  } else {
    alert('10mb 이하의 이미지만 첨부할 수 있습니다.');
  }
};

const submitReport = () => {
  // TODO: 서버로 신고 데이터 전송
  console.log('신고유형:', selectedType.value);
  console.log('내용:', description.value);
  console.log('이미지파일:', imageFile.value);
};
</script>

<style scoped>
.form_wrap {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
}
.report_step_box {
  min-height: 460px;
}
.form_title {
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
}
.report_type_list {
  display: flex;
  flex-direction: column;
}
.report_type_list li {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.report_type_list button {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
  padding: 10px 15px;
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 8px;
  color: #000;
}
.report_type_list > strong {
  font-size: 18px;
  font-weight: bold;
}
.report_type_list > p {
  font-size: 14px;
  font-weight: normal;
}
.report_type_list button.selected {
  border: 2px solid #000;
}

/* .input_title,
.input_content {
  width: 100%;
  margin-top: 12px;
  padding: 8px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
}
.input_content {
  height: 120px;
  resize: none;
} */
.go_guid_link {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #fff;
  margin-bottom: 50px;
  text-decoration: underline;
}
.submit_button:disabled {
  opacity: 0.5;
}
.submit_button {
  background: black;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  width: 136px;
  border: 2px solid #f1cfc8;
  border-radius: 42px;
  align-self: self-end;
}
</style>
