<template>
  <footer class="BaseFooter">
    <div v-if="isWorldTour" class="BaseFooterintro">
      <span>W-Darkmap Tour of</span>
      <a
        :href="'https://weareshadowpins.com/'"
        target="_blank"
        class="BaseFooterlink"
      >
        Shadow Pins
      </a>
      <span>Ver.1.1</span>
    </div>
    <div v-else class="BaseFooterintro">
      <a
        :href="'https://weareshadowpins.com/'"
        target="_blank"
        class="BaseFooterlink"
      >
        셰도우 핀즈 </a
      >의 K-다크맵 투어 Ver.1.1
    </div>
    <div v-if="isWorldTour" class="BaseFootercontainer">
      <a
        :href="'https://dune-purple-f80.notion.site/About-Our-Services-ENG-36825ce1e4e9801694c7e0f6d12fd3d0'"
        target="_blank"
        class="BaseFooterlink"
        >About Our Services</a
      >
      <a
        :href="'https://dune-purple-f80.notion.site/V1-1-2026-3-7-ENG-36825ce1e4e980cf96d9c3370151487b'"
        target="_blank"
        rel="noopener noreferrer"
        class="BaseFooterlink"
      >
        Privacy Policy
      </a>
      <a
        :href="'https://forms.gle/Kr93YqK5ZjsiqvpF6'"
        target="_blank"
        class="BaseFooterlink"
        >Contact Us</a
      >
    </div>
    <div v-else class="BaseFootercontainer">
      <a
        :href="'https://www.notion.so/20025ce1e4e980689f25e1db1373fd9c'"
        target="_blank"
        rel="noopener noreferrer"
        class="BaseFooterlink"
      >
        개인정보처리방침
      </a>
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
</template>

<script setup>
defineProps({
  isWorldTour: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.BaseFooter {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #ffefeb;
  margin-top: 0;
  padding-bottom: 8px;

  &intro {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 4px;
  }

  &container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .BaseFooterlink {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #ffefeb;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
