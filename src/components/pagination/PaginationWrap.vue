<template>
  <div class="pagination">
    <button class="prev_next" @click="$emit('prev')">
      <img style="width: 5px" src="@/assets/leftArrow.svg" />
    </button>
    <button
      v-for="page in pageNumbers"
      :key="page"
      @click="$emit('page-change', page)"
      :class="{ selected_page: page === currentPage }"
      class="pagination_number_button"
    >
      {{ page }}
    </button>
    <button class="prev_next" @click="$emit('next')">
      <img style="width: 5px" src="@/assets/rightArrow.svg" />
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
defineProps({
  currentPage: Number,
  pageNumbers: Array,
});
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}
.pagination_number_button {
  padding: 5px 10px;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 30px;
}
.selected_page {
  font-weight: bold;
  background: #4b7de2;
}
</style>
