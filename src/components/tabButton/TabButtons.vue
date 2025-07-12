<template>
  <div class="tab_buttons_wrap">
    <button
      v-for="tab in tabs"
      :key="tab"
      :class="{ active: modelValue === tab }"
      @click="$emit('update:modelValue', tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
.tab_buttons_wrap {
  display: flex;
  margin-bottom: 20px;

  button {
    flex: 1;
    padding: 12px 0;
    font-weight: bold;
    font-size: 15px;
    color: #9886dc;
    background: none;
    border: none;
    cursor: pointer;
    border-bottom: 2px solid #9886dc;

    &.active {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }
}
</style>
