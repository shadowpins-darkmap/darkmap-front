<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue';
import '@/styles/AddressFilter.scss';
import BaseDropdown from './BaseDropdown.vue';

const ALL_REGIONS = '전국';

const props = defineProps({
  addressData: {
    type: Array,
    required: true,
  },
});

const selectedGu = ref(ALL_REGIONS);
const openDropdown = ref(false);
const emit = defineEmits(['change']);

const guList = computed(() => [
  ALL_REGIONS,
  ...props.addressData.map((item) => item.lv1),
]);

const clickGu = (lv1) => {
  selectedGu.value = lv1;
  openDropdown.value = false;
  emit('change', lv1);
};
</script>

<template>
  <BaseDropdown :list="guList" :onSelect="clickGu" :selected="selectedGu" />
</template>
