<template>
  <div class="BaseCommunity">
    <section class="BaseCommunity__popup">
			
		</section>
    <section class="BaseCommunity__popup"></section>
  </div>
</template>

<script setup>
// import { ref, computed, defineEmits, watch } from 'vue';
// import { useDevice } from '@/composables/useDevice';

// const { isMobile } = useDevice();
</script>

<style scoped lang="scss">
.BaseCommunity {
  position: absolute;
  right: 40px;
  top: 40px;
  height: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  gap: 40px;

  &__popup {
    width: 436px;
    padding: 25px;
    border: solid 2px #f1cfc8;
    background-color: #6d54ce;
    border-radius: 20px;
  }
}
</style>
