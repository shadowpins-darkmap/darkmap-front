<template>
  <div class="logo">
    <img width="198px" height="198px" src="../assets/logo1.svg" />
  </div>
  <div class="head_panel">
    <div style="display: flex">
      <div class="crime_logo" style="background: #ffa8a8">
        <img src="../assets/flasherLogo.svg" />
      </div>
      <div class="header_text">바바리맨</div>
    </div>
    <div style="display: flex">
      <div class="crime_logo" style="background: #1cd6ff">
        <img src="../assets/huntingLogo2.svg" />
      </div>
      <div class="header_text">헌팅</div>
    </div>
    <div style="display: flex">
      <div class="crime_logo" style="background: #b56bff">
        <img src="../assets/chasingLogo2.svg" />
      </div>
      <div class="header_text">미행</div>
    </div>
    <div style="display: flex">
      <div class="crime_logo" style="background: #ffed89">
        <img src="../assets/assaultLogo.svg" />
      </div>
      <div class="header_text">폭행</div>
    </div>
  </div>
  <div class="body_panel">
    <div class="body_title">테마 투어</div>
    <div class="select_all">
      <div @click="clickAllCrime">
        <img
          v-if="allCrimeChecked"
          class="check"
          src="../assets/checkbox.svg" />
        <img
          v-if="!allCrimeChecked"
          class="check"
          src="../assets/unchecked.svg" />
      </div>
      <div class="checkbox_text">길거리 괴롭힘 전체</div>
    </div>
    <div class="checkboxes">
      <div class="checkbox" v-for="(c, idx) in crimeTypes" v-bind:key="idx">
        <div @click="clickCrimeType(idx)">
          <img v-if="c.checked" class="check" src="../assets/checkbox.svg" />
          <img v-if="!c.checked" class="check" src="../assets/unchecked.svg" />
        </div>
        <div class="checkbox_text">{{ c.crimeType }}</div>
      </div>
    </div>
    <div style="display: flex; margin-top: 30px">
      <div class="body_title">지역 투어</div>
      <address-filter
        :address-data="addressData"
        @change="changeGu"></address-filter>
    </div>
    <div class="select_all">
      <div @click="clickAllDong">
        <img v-if="allDongChecked" class="check" src="../assets/checkbox.svg" />
        <img
          v-if="!allDongChecked"
          class="check"
          src="../assets/unchecked.svg" />
      </div>
      <div class="checkbox_text">{{ selectGu }} 전체</div>
    </div>
    <div class="checkboxes">
      <div class="checkbox" v-for="(d, idx) in dongList" v-bind:key="idx">
        <div @click="clickDong(idx)">
          <img v-if="d.checked" class="check" src="../assets/checkbox.svg" />
          <img v-if="!d.checked" class="check" src="../assets/unchecked.svg" />
        </div>
        <div class="checkbox_text">{{ d.name }}</div>
      </div>
    </div>
    <div class="body_title" style="margin-top: 30px">뉴스 투어</div>
    <div
      style="
        border: 0;
        height: 2px;
        background: #00ffc2;
        margin-top: 20px;
      "></div>
    <div class="article_table">
      <div class="table_position">
        시군구 주소
      </div>
      <div class="table_title">제목</div>
    </div>
    <div style="border: 0; height: 1px; background: #00ffc2"></div>
    <div class="article_table">
      <div class="table_position">
        시군구 주소
      </div>
      <div class="table_title">제목목</div>
    </div>
    <div style="border: 0; height: 1px; background: #00ffc2"></div>
    <div class="article_table">
      <div class="table_position">
        시군구 주소
      </div>
      <div class="table_title">제목</div>
    </div>
    <div style="border: 0; height: 1px; background: #00ffc2"></div>
    <div class="article_table">
      <div class="table_position">
        시군구 주소소
      </div>
      <div class="table_title">제목</div>
    </div>
    <div style="border: 0; height: 2px; background: #00ffc2"></div>
    <div class="paging">
      <img style="width: 4px" src="../assets/leftArrow.svg" />
      <div class="paging_numbers" style="margin: 0 30px">
        <div class="selected_page paging_number">1</div>
        <div class="paging_number">2</div>
        <div class="paging_number">3</div>
        <div class="paging_number">4</div>
        <div class="paging_number">5</div>
      </div>
      <img style="width: 4px" src="../assets/rightArrow.svg" />
    </div>
  </div>
</template>

<script setup>
// import { useNewsListStore } from "@/store/newsListStore"
// import { storeToRefs } from "pinia"
import AddressFilter from "./AddressFilter.vue"
import addressData from "@/constant/addresses.json"
import "@/styles/ControlPopup.scss"
import { ref, computed, defineEmits } from 'vue';

const emits = defineEmits(['changeFilter'])

// const { articles } = storeToRefs(useNewsListStore())

const crimeTypes = ref([
  {
    crimeType: "바바리맨",
    checked: true,
  },
  {
    crimeType: "헌팅",
    checked: true,
  },
  {
    crimeType: "미행",
    checked: true,
  },
  {
    crimeType: "폭행",
    checked: true,
  },
])

const allCrimeChecked = computed(() => {
  return crimeTypes.value.filter(({ checked }) => checked).length === 4
})

const clickAllCrime = () => {
  if (allCrimeChecked.value) {
    crimeTypes.value.forEach((c) => {
      c.checked = false
    })
  } else {
    crimeTypes.value.forEach((c) => {
      c.checked = true
    })
  }
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value)
}

const clickCrimeType = (idx) => {
  // 체크 박스 연동
  crimeTypes.value[idx].checked = !crimeTypes.value[idx].checked
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value)
}

// Address handling
const selectGu = ref(addressData[0].lv1)
const dongList = ref([])

// Initialize dongList with checked property
const initializeDongList = (lv1) => {
  const selectedAddress = addressData.find((addr) => addr.lv1 === lv1)
  if (selectedAddress) {
    dongList.value = selectedAddress.lv2.map((dong) => ({
      name: dong,
      checked: true,
    }))
  }
}

// Initialize dongList with first lv1
initializeDongList(selectGu.value)

const changeGu = (newGu) => {
  // Changed to receive single parameter
  selectGu.value = newGu
  initializeDongList(newGu)
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value)
}

const allDongChecked = computed(() => {
  return dongList.value.every((dong) => dong.checked)
})

const clickAllDong = () => {
  const newCheckedState = !allDongChecked.value
  dongList.value.forEach((dong) => {
    dong.checked = newCheckedState
  })
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value)
}

const clickDong = (idx) => {
  dongList.value[idx].checked = !dongList.value[idx].checked
  console.log(selectGu.value)
  console.log(dongList.value);
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value)
}
</script>
