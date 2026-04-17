<template>
  <article class="CaseCard">
    <span class="CaseCard__date">{{ date }}</span>
    <p class="CaseCard__summary">{{ summary }}</p>
  </article>
</template>

<script setup>
defineProps({
  date: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.CaseCard {
  border: 1px solid rgba(0, 255, 194, 0.55);
  border-radius: 10px;
  background: rgba(0, 255, 194, 0.14);
  padding: 10px;
}

.CaseCard__date {
  display: inline-block;
  color: #00ffc2;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 4px;
}

.CaseCard__summary {
  color: #e6fff8;
  font-size: 11px;
  line-height: 1.5;
}
</style>
