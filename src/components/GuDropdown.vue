<script setup>
import { ref, defineEmits } from 'vue'
import { gu } from '@/constant/seoul'

const selectedGu = ref(gu[0]);

const openDropdown = ref(false);

const clickGu = (idx) => {
  selectedGu.value = gu[idx]
  openDropdown.value = false
  emit('change', idx)
}

const emit = defineEmits(['change'])

const isLast = (idx) => idx === gu.length - 1

</script>

<template>
<div style="position: relative; margin-left: 8px">
  <div class="dropdown" @click="() => openDropdown = !openDropdown">
    <div class="dropdown_text">{{ selectedGu }}</div>
    <img style="width: 22px; height: 22px;" src="../assets/arrowDropDown.svg">
  </div>
  <div class="dropdown-list" v-if="openDropdown">
    <div :class="['dropdown-item', isLast(idx) ? '' : 'not-last']" v-for="(g, idx) in gu" v-bind:key="idx" @click="clickGu(idx)">{{ g }}</div>
  </div>
</div>
</template>

<style scoped lang="scss">
.dropdown {
  display: flex;
  justify-content: space-between;
  width: 88px;
  height: 24px;
  border-radius: 12px;
  border: solid 2px #FFEFEB;
  padding-left: 6px;
  box-sizing: border-box;
}

.dropdown:hover {
  cursor: pointer;
}

.dropdown_text {
  color: #FFEFEB;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.dropdown-list {
  position: absolute;
  top: 32px;
  border: solid 1px #FFEFEB;
  border-radius: 9px;
  background-color: #6172E2;
  width: 88px;
  height: 86px;
  overflow-y : scroll;
  overflow-x: hidden;
  box-sizing: border-box;

  &::-webkit-scrollbar{
    display: none;
  }
}

.dropdown-item {
  width: 86px;
  height: 28px;
  font-size: 14px;
  line-height: 28px;
  box-sizing: border-box;
  color: #FFEFEB;
  font-weight: bold;
  text-align: center;
}

.not-last {
  border-bottom: 1px solid #FFEFEB;
}
</style>