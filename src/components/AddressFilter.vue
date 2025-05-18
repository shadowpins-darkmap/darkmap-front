<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import '@/styles/AddressFilter.scss';
import BaseDropdown from './BaseDropdown.vue';

const props = defineProps({
  addressData: {
    type: Array,
    required: true,
  },
});

const selectedGu = ref(props.addressData[0].lv1);
const openDropdown = ref(false);
const emit = defineEmits(['change']);

const clickGu = (lv1) => {
  selectedGu.value = lv1;
  openDropdown.value = false;
  emit('change', lv1);
};
</script>

<template>
  <BaseDropdown
    :list="addressData.map((item) => item.lv1)"
    :onSelect="clickGu"
    :selected="selectedGu"
  />
</template>
