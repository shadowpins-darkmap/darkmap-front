<template>
  <div class="BaseDropdown" ref="dropdownRef">
    <button class="BaseDropdown__toggle" @click="toggleDropdown">
      {{ selectedLabel }}
    </button>
    <div v-if="isOpen" class="BaseDropdown__menu">
      <button class="BaseDropdown__selected" @click="toggleDropdown">
        {{ selectedLabel }}
      </button>
      <ul class="BaseDropdown__menuList scroll_area">
        <li v-for="(item, index) in list" :key="index">
          <button class="BaseDropdown__menuItem" @click="handleSelect(item)">
            {{ item }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, watch } from 'vue';

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
  selected: {
    type: String,
    default: '',
  },
  onSelect: {
    type: Function,
    required: true,
  },
});

const isOpen = ref(false);
const selectedLabel = ref(props.selected || props.list[0]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleSelect = (item) => {
  selectedLabel.value = item;
  isOpen.value = false;
  props.onSelect(item);
};

watch(
  () => props.selected,
  (newVal) => {
    if (newVal !== selectedLabel.value) {
      selectedLabel.value = newVal;
    }
  },
);

const dropdownRef = ref(null);
const onClickOutside = (e) => {
  if (!dropdownRef.value?.contains(e.target)) {
    isOpen.value = false;
  }
};
onMounted(() => window.addEventListener('mousedown', onClickOutside));
onUnmounted(() => window.removeEventListener('mousedown', onClickOutside));
</script>

<style scoped lang="scss">
.BaseDropdown {
  position: relative;
  display: inline-block;
  color: #ffefeb;
  font-weight: 700;
  text-align: left;
  font-size: 14px;

  &__toggle {
    min-width: 80px;
    padding: 4px 8px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    border: 2px solid #ffefeb;
    border-radius: 30px;
    background: transparent;
    color: #ffefeb;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &::after {
      margin-left: 8px;
      content: '';
      width: 8px;
      height: 8px;
      background-image: url('@/assets/arrowDropDown.svg');
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  &__menu {
    position: absolute;
    top: 30px;
    left: 0px;
    background: #5966d8;
    padding: 7px 10px;
    border: 2px solid #ffefeb;
    border-radius: 16px;
    min-width: 146px;
    height: auto;
    max-height: 185px;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  &__selected {
    width: 100%;
    padding: 0;
    background: inherit;
    border: 0;
    display: block;
    text-align: left;
    cursor: pointer;
    font-weight: inherit;
    color: inherit;
    font-size: inherit;
  }

  &__menuList {
    max-height: 155px;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    margin-top: 4px;
    border-top: 1px solid #fff;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar:hover {
      width: 10px;
      height: 10px;
    }
    &::-webkit-scrollbar-button {
      display: none;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ffefeb;
      border-radius: 6px;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(255, 239, 235, 0.65);
      margin: 6px 0;
      border-radius: 6px;
    }

    li &:first-child {
      margin-top: 4px;
    }
  }

  &__menuItem {
    width: 100%;
    text-align: left;
    padding: 5px 0;
    cursor: pointer;
    color: inherit;
    background: inherit;
    border: 0;
    font-weight: 700;
    line-height: 1;
  }
}
</style>
