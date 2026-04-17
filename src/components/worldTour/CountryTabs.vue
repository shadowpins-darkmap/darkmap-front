<template>
  <div class="CountryTabs">
    <button
      v-for="country in countries"
      :key="country"
      class="CountryTabs__item"
      :class="{ selected: country === selectedCountry }"
      @click="$emit('change', country)"
    >
      {{ country }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  countries: {
    type: Array,
    required: true,
  },
  selectedCountry: {
    type: String,
    required: true,
  },
});

defineEmits(['change']);
</script>

<style scoped lang="scss">
.CountryTabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
}

.CountryTabs__item {
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #00ffc2;
  color: #00ffc2;
  font-size: 11px;
  font-weight: 700;
}

.CountryTabs__item.selected {
  background: #00ffc2;
  color: #0b0b12;
}
</style>
