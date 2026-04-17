<template>
  <div class="WorldTourFAQ">
    <button
      class="WorldTourFAQ__item"
      v-for="(item, key) in faqItems"
      :key="key"
      @click="$emit('open', key)"
    >
      <span>{{ item.title }}</span>
      <img
        src="@/assets/arrowCirlcleButtonRight.svg"
        alt="open faq"
        width="12"
        height="12"
      />
    </button>
  </div>
</template>

<script setup>
defineProps({
  faqItems: {
    type: Object,
    required: true,
  },
});

defineEmits(['open']);
</script>

<style scoped lang="scss">
.WorldTourFAQ {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.WorldTourFAQ__item {
  width: 100%;
  text-align: left;
  border: 1px solid rgba(241, 207, 200, 0.5);
  border-radius: 10px;
  padding: 8px 10px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
}
</style>
