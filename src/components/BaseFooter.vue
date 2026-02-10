<template>
  <footer class="BaseFooter">
    <div class="BaseFooterintro">
      <a
        :href="'https://weareshadowpins.com/'"
        target="_blank"
        class="BaseFooterlink"
      >
        셰도우 핀즈 </a
      >의 K-다크맵 투어 Ver.1.1
    </div>
    <div class="BaseFootercontainer">
      <button
        type="button"
        class="BaseFooterlink"
        @click="isTermsPanelOpen = true"
      >
        개인정보처리방침
      </button>
      <a
        :href="'https://forms.gle/Kr93YqK5ZjsiqvpF6'"
        target="_blank"
        class="BaseFooterlink"
        >문의</a
      >
      <a
        :href="'https://dune-purple-f80.notion.site/21325ce1e4e9803393abfe29d60323b4'"
        target="_blank"
        class="BaseFooterlink"
        >서비스 소개</a
      >
    </div>
  </footer>

  <!-- 사이트 이용약관 -->
  <SlidePanel
    :width="'510px'"
    :visible="isTermsPanelOpen"
    @close="isTermsPanelOpen = false"
    :right="'auto'"
    :left="'0'"
  >
    <TermsSidePanel
      @close="isTermsPanelOpen = false"
      @open-terms-panel="isTermsPanelOpen = true"
    />
  </SlidePanel>
</template>

<script setup>
import { ref } from 'vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';
import TermsSidePanel from '@/components/commonPanel/TermsSidePanel.vue';
const isTermsPanelOpen = ref(false);
</script>

<style lang="scss" scoped>
.BaseFooter {
  font-family: 'Roboto', sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: #FFEFEB;
  margin-top: 20px;
  padding-bottom: 5px;

  &intro {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  &container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__link {
    display: block;
    text-decoration: underline;
    color: #FFEFEB;
  }
  .BaseFooterlink {
    font-family: 'Roboto', sans-serif;
    font-size: 10px;
    font-weight: 500;
    color: #FFEFEB;
    text-decoration: underline;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
}
</style>
