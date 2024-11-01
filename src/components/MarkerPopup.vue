<template>
  <div class="popup">
    <button style="width: 20px; height: 20px;" @click="closeWindow">X</button>
    <div>popuppopup</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
defineProps({
  closeWindow: {
    type: Function,
    required: true,
  }
})
</script>

<style scoped lang="scss">
.popup {
  position: relative;
  display: flex;
  width: 400px;
  height: 368px;
  border: solid 1px #4E5277;
  background-color: #313457;
  border-radius: 2px;
  z-index: 2;
  pointer-events: all;
}
</style>