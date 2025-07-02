<template>
  <footer class="BaseFooter">
    <div class="BaseFooterintro">
      <a :href="LINK_LIST.intro" target="_blank" class="BaseFooterlink">
        셰도우 핀즈 </a
      >의 K-다크맵 투어 Ver.1.0
    </div>
    <div class="BaseFootercontainer">
      <a :href="LINK_LIST.privacyPolicy" target="_blank" class="BaseFooterlink">
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
const LINK_LIST = {
  intro: 'https://weareshadowpins.com/',
  privacyPolicy:
    'https://dune-purple-f80.notion.site/20025ce1e4e980689f25e1db1373fd9c?pvs=4',
  contact: '',
};
</script>

<style lang="scss" scoped>
.BaseFooter {
  font-size: 12px;
  font-weight: 500;
  color: #fff;

  &intro {
    display: flex;
    align-items: center;
  }

  &container {
    display: flex;
    align-items: center;
    margin-top: 10px;
    gap: 14px;
  }

  &__link {
    display: block;
    text-decoration: underline;
    color: #fff;
  }
  .BaseFooterlink {
    color: #fff;
    text-decoration: underline;
  }
}
</style>
