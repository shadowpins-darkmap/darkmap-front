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
      <button class="BaseFooterlink BaseFooterlink--btn" @click="showContact = true">
        Contact Us
      </button>
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

  <Teleport to="body">
    <div v-if="showContact" class="ContactModal__backdrop" @click.self="showContact = false">
      <div class="ContactModal">
        <p class="ContactModal__title">Contact Us</p>
        <p class="ContactModal__email">weareshadowpins@gmail.com</p>
        <a
          href="mailto:weareshadowpins@gmail.com"
          class="ContactModal__btn ContactModal__btn--primary"
          @click="showContact = false"
        >Open mail app</a>
        <a
          href="https://mail.google.com/mail/?view=cm&to=weareshadowpins@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          class="ContactModal__btn ContactModal__btn--secondary"
          @click="showContact = false"
        >Send via Gmail (web)</a>
        <button class="ContactModal__close" @click="showContact = false">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  isWorldTour: {
    type: Boolean,
    default: false,
  },
});

const showContact = ref(false);
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

    &--btn {
      background: none;
      border: none;
      padding: 0;
    }
  }
}
</style>

<style lang="scss">
.ContactModal__backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.ContactModal {
  width: min(90vw, 300px);
  border: 1px solid #f1cfc8;
  border-radius: 12px;
  background: #6d54ce;
  padding: 34px 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: center;
  color: #fff;

  &__title {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: #fff;
  }

  &__email {
    margin: 0;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
    word-break: break-all;
  }

  &__btn {
    display: block;
    padding: 11px 10px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;

    &--primary {
      background: #000;
      color: #fff;
    }

    &--secondary {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
  }

  &__close {
    margin-top: 2px;
    background: none;
    border: none;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
  }
}
</style>
