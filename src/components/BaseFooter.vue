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

<style lang="scss" scoped>
.BaseFooter {
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #ffefeb;
  margin-top: 20px;
  padding-bottom: 5px;

  &intro {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
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
