<template>
  <div class="slider_wrap slider_2deps">
    <button class="slider_colse_button" @click="$emit('close')">
      <img
        src="@/assets/slider2depsCloseIcon.svg"
        alt="slider 2deps close icon"
        width="36"
        height="36"
      />
    </button>

    <strong class="slider_title">{{ detailType }}</strong>
    <div class="slider_contents_wrap scroll_area">
      <!-- 바바리맨 -->
      <template v-if="detailType === '바바리맨'">
        <p class="slider_contents">
          바바리맨은 한국문화권의 관용구로 바바리 (=트렌치 코트)를 입고 안에는
          알몸상태인 남성을 가리킵니다. 이들은 주로 미성년의 여성들이 모여있는
          여고 등 학교 앞에 나타나서 코트를 활짝 펼쳐 자신의 신체를 노출하는
          행위를 하는데 최근에는, 이 패턴에서 확장되어 나이를 가리지 않으며
          수법도 대중교통 등의 공중 공간에서 이뤄지는 자위 혹은 신체 일부 노출,
          체액을 묻히는 행위로까지 번지고 있습니다.
        </p>
        <p class="slider_contents">
          주 범죄 대상이 미성년 여성들임에도 이들에게는 미성년자 성희롱이나
          아동학대 같은 무거운 사건의 가해자로 다뤄지지 않습니다. 경범죄처벌법
          제1조 제41호에서는 ‘공연음란죄’를, “여러 사람의 눈에 뜨이는 곳에서
          함부로 알몸을 지나치게 내놓거나 속까지 들여다 보이는 옷을 입거나 또는
          가려야 할 곳을 내어 놓아 다른 사람에게 부끄러운 느낌이나 불쾌감을 준
          사람”라고 규정하고 있으나 이는 피해당사자인 여성의 관점을 충분히
          반영한 정의라고 하기에는 충분치 않습니다.
        </p>
        <p class="slider_contents">
          향후 이 폭력의 되물림 고리를 끊으려면 ‘학교앞’, ‘대중교통’부터
          수사/치안적 대책과 재범에 대한 중한 처벌, 특히 교육기관 건물 앞에서
          있어난 미성년자 성희롱으로서의 가중처벌 적용, 실효성 있는 가해자
          재사회화 교육이 필요합니다.
        </p>
      </template>

      <!-- 폭행 -->
      <template v-else-if="detailType === '폭행'">
        <p class="slider_contents">
          저희가 수집한 여성 특정 길거리 폭행은 크게 두가지 유형으로
          나뉘었습니다. 성별이 ‘여성’이라서 자신의 분노를 투사해 분풀이하기 좋은
          상대로 여겨져 표적이 된 경우와, 구애 같은 자신의 요청을 여성이
          거절했을때 보복성으로 폭력이 일어나는 경우가 있었고, 폭행이 분리되서
          독립적으로 일어나기보다 살인이나 성폭력, 데이트폭력과 스토킹 같은
          범죄와 연쇄적으로 묶여서 발생하는 양상을 보였습니다.
        </p>
        <p class="slider_contents">
          전자의 경우 언론에서는 ‘흉기난동’으로 포괄해 부르거나, 가해자가
          처음부터 여성을 범죄대상으로 염두하고 벌인 폭행임에도 ‘묻지마 범죄’,
          ‘묻지마 폭행’이라는 부정확한 지칭을 하기도 합니다. ‘여성 살해’, ‘여성
          폭행’, ‘여성혐오 범죄’로 명명하는 기사들은 여전히 매우 소수입니다.
          또한 한국에서는 남성이 가해자이고 여성이 피해자인 경우, 폭력에
          관대하며 대응이 미온적이고 가해자의 입장에서 범죄의도를 이해하고자
          하는 동정론에 기대는 사회적 분위기가 만연해있습니다.
        </p>
        <p class="slider_contents">
          후자의 경우는 여성이라는 집단이 성애적인 대상이 되는 동시에 손쉬운
          폭행의 투사 대상이 된다는 점을 먼저 이해해야 합니다. 헌팅을 거절했다는
          이유로 손찌검을 하는 남자에게 길거리에서 폭행당하는 급격한 대상화
          방식의 전환이 일어나는 일이 여성들에게는 이미 익숙합니다. ‘거절’이라는
          의사표현의 권리가 손쉽게 저해되고, 성적 대상이 되지 않은자는 곧
          폭행당할만한 이유를 제공한 상대로 돌변되는 흑백 선택지가 여성에게는
          지나치게 일상적인 일이 되었습니다. 여성 스스로 알아서 더 작고 부드럽게
          거절하고, 남성의 기분을 거스르지 않게 하는 처세는 폭력당하지 않을
          권리의 조건이 되어서는 안될 것입니다. 가해자의 문제적 행위를 차단하기
          위해 관련 범죄에 대한 혐오 범죄, 페미사이드 등의 혐의가 더해진
          가중처벌 등 사회적 방비책 마련이 시급합니다.
        </p>
        <!-- <p class="slider_contents">출처: https://femiwiki.com/w/묻지마_범죄</p> -->
      </template>

      <!-- 헌팅 -->
      <template v-else-if="detailType === '헌팅'">
        <p class="slider_contents">
          길거리 괴롭힘(Street Harassment)의 보편적 정의에서는 캣콜링(Cat
          Calling)의 뜻도 포괄하고 있습니다. 남성이 길가에서 처음보는 낯선
          여성에게 느닷없이 인사나 친근감을 표하거나 외모에 대한 칭찬을 가장한
          성희롱 언행을 하여 불쾌감을 주는 행위를 캣콜링이라고 하는데*,
          한국에서보다는 이탈리아 등의 서구권에서 더 흔한 행위입니다.
        </p>
        <p class="slider_contents">
          한국 남성들의 다수는 길거리에서 만난 처음보는 여성에게 휘파람을 불거나
          외모를 추켜세우면서 치근덕대지 않습니다. 몇년 새 헌팅포차라는 특수한
          공간이 생겨났지만 그곳에 일어나는 여성 폭행 등의 일은 해프닝으로
          여겨지고 진지하게 미디어에서 다뤄지지 않으며 그 기사 수도 다른 유형에
          비해 적습니다. 여성의 성적매력을 칭송하는 캣콜링보다는 전화번호나
          남자친구가 있냐고 물어보는 식으로 서구권에 비해 소극적인 구애의
          경향성을 보이며, 이에 대해 상대가 거절할 시 스토킹이나 폭행으로
          여성에게 보복하고, 심한 경우 납치와 감금, 성폭력을 동반한 범죄로
          이어집니다.
        </p>
        <p class="slider_contents">
          한국남성들이 집단적으로 여성을 동등한 지위의 로맨틱한 데이트
          상대라기보다는, 너무나 손쉽게 폭력을 가할 수 있는 대상으로 보고 있음을
          심각하게 이 사회가 하나의 전조현상으로 바라볼 필요가 있습니다.
          한국사회의 왜곡된 성인지 교육, 데이팅 문화, 미디어가 이러한 한국
          특유의 강간문화 전반을 가볍게 소비하는 방식을 모두 반성적으로 성찰해야
          합니다.
        </p>
        <!-- <p class="slider_contents">출처: https://femiwiki.com/w/캣콜링</p> -->
      </template>

      <!-- 미행 -->
      <template v-else-if="detailType === '미행'">
        <p class="slider_contents">
          길가, 화장실과 엘레베이터에서 여성의 뒤꽁무니를 따라 붙는 남성들에게는
          다양한 범죄 의도가 잠재합니다. 실제 많은 미행 괴롭힘이 스토킹과
          성추행, 불법촬영, 주거침입과 밀접하고 연쇄적으로 일어나며 불발과
          미수에 그친다고 해도 여성들은 집단적 경험과 기존 사례에 근거해서
          안전에 대한 불안감을 느낍니다.
        </p>
        <p class="slider_contents">
          술에 취해있는 것처럼 약해진 상태의 여성들을 따라가 말을 걸거나 성폭력,
          납치, 강도를 하려는 시도도 적지 않았습니다. 뿐만아니라 실제 추가
          범죄와 이어지지 않더라도 여대가 몰려 있는 특정 지역을 반복적으로
          배회하며 여성들의 집 비밀번호를 알아내려 하고 전화번호를 묻는식의
          헌팅을 반복적으로 하는 사례처럼, 미행 그 자체만으로도 이미 해당 지역의
          치안의 질을 하락시키는 경우가 있었습니다. 남성이 자신의 목적을 밝히지
          않고 처음 본 여성을 집요하게 반복적으로 미행하는 행위 자체가
          자연스럽지 못한 문제적 행동이고, 범죄로서 무겁게 다뤄져야 더 많은 강력
          사건을 예방할 수 있음에 대한 사회적 논의가 지금 당장 시작되어야
          합니다.
        </p>
      </template>

      <!-- 기타 -->
      <template v-else>
        <p class="slider_contents">
          아직 카테고리화될 수 없고 이름을 갖지 못한 그 외 형태의 길거리괴롭힘도
          있습니다. 신촌이나 강남 같은 유흥시설 밀집 지역 거리에 흩뿌려져 있는
          성매매 광고 홍보 전단지를 볼 때의 불쾌감, 강도와 납치의 위협,
          불법촬영과 각종 성추행, 젊은 여성에게 더 과하게 이뤄지는 호객행위 같은
          사건들이 이 사회에서 여성의 동선을 제약하고 그들의 태도를 위축시키고
          있습니다. 우리에게는 그것이 어디서 일어난 폭력이었는지는 물론 여성의
          일생에 어떤 영향을 끼쳤는지 말할 수 있는 더 많은 목소리가 필요합니다.
        </p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
// emits: close
defineProps({
  detailType: {
    required: true,
  },
});
</script>
<style scoped lang="scss">
/* 사이드 슬라이더 */
.slider_wrap {
  background-color: #000;
  padding: 40px 25px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.slider_2deps {
  background-color: #404040;
}
.slider_colse_button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.slider_title {
  font-weight: bold;
  font-size: 32px;
  display: flex;
  padding-top: 40px;
  padding-bottom: 60px;
}
.ponit_color {
  color: #8270cb;
}
.slider_contents {
  padding-bottom: 25px;
  font-size: 16px;
  color: #fff;
  font-weight: normal;
}
.slider_contents_wrap {
  overflow-y: auto;
  max-height: 600px;
}
.slider_title_sub {
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  padding-bottom: 20px;
}
.slider_list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.slider_list_button {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.slider_list_button > span {
  padding-top: 4px;
}
.slider_list_icon {
  margin-left: 5px;
}
</style>
