<script setup>
import { ref, defineEmits, defineProps } from "vue"
import "@/styles/AddressFilter.scss"

const props = defineProps({
  addressData: {
    type: Array,
    required: true,
  },
})

const selectedGu = ref(props.addressData[0].lv1)
const openDropdown = ref(false)
const emit = defineEmits(["change"])

const clickGu = (lv1) => {
  selectedGu.value = lv1
  openDropdown.value = false
  emit("change", lv1)
}

const isLast = (idx) => idx === props.addressData.length - 1
</script>

<template>
  <div style="position: relative; margin-left: 8px">
    <div class="dropdown" @click="() => (openDropdown = !openDropdown)">
      <div class="dropdown_text">{{ selectedGu }}</div>
      <img src="../assets/arrowDropDown.svg" />
    </div>
    <div class="dropdown-list" v-if="openDropdown">
      <div v-for="(address, idx) in addressData" :key="idx">
        <div
          :class="['dropdown-item', isLast(idx) ? '' : 'not-last']"
          @click="clickGu(address.lv1)">
          {{ address.lv1 }}
        </div>
      </div>
    </div>
  </div>
</template>
