<template>
  <div class="empty_data_wrap">
    <img
      src="@/assets/dataNone.svg"
      alt="empty data"
      width="120"
      height="120"
      class="empty_data_image"
    />
    <p class="empty_data_text">작성된 {{ type }}이 없습니다.</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  type: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.empty_data_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
}
.empty_data_image {
}
.empty_data_text {
  font-size: 14px;
  padding-bottom: 10px;
}
</style>
