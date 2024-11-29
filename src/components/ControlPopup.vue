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
      <div class="crime_logo" style="background: #b56bff">
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
      <gu-dropdown @change="changeGu"></gu-dropdown>
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
      <div class="checkbox" v-for="(d, idx) in dong[selectGu]" v-bind:key="idx">
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
        {{ articles[0].sigungu }} {{ articles[0].dong }}
      </div>
      <div class="table_title">{{ articles[0].title }}</div>
    </div>
    <div style="border: 0; height: 1px; background: #00ffc2"></div>
    <div class="article_table">
      <div class="table_position">
        {{ articles[1].sigungu }} {{ articles[1].dong }}
      </div>
      <div class="table_title">{{ articles[1].title }}</div>
    </div>
    <div style="border: 0; height: 1px; background: #00ffc2"></div>
    <div class="article_table">
      <div class="table_position">
        {{ articles[2].sigungu }} {{ articles[2].dong }}
      </div>
      <div class="table_title">{{ articles[2].title }}</div>
    </div>
    <div style="border: 0; height: 1px; background: #00ffc2"></div>
    <div class="article_table">
      <div class="table_position">
        {{ articles[3].sigungu }} {{ articles[3].dong }}
      </div>
      <div class="table_title">{{ articles[3].title }}</div>
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
import { dong, gu } from "@/constant/seoul"
import { useNewsListStore } from "@/store/newsListStore"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import GuDropdown from "./GuDropdown.vue"

const { articles } = storeToRefs(useNewsListStore())

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
])

const allCrimeChecked = computed(() => {
  return crimeTypes.value.filter(({ checked }) => checked).length === 3
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
}

const clickCrimeType = (idx) => {
  // 체크 박스 연동
  crimeTypes.value[idx].checked = !crimeTypes.value[idx].checked
  // 필터링 로직 넣기
}

const selectGu = ref(gu[0])
const changeGu = (idx) => {
  selectGu.value = gu[idx]
}

const allDongChecked = computed(() => {
  return (
    dong.value[selectGu.value].filter(({ checked }) => checked).length ===
    dong.value[selectGu.value].length
  )
})

const clickAllDong = () => {
  if (allDongChecked.value) {
    dong.value[selectGu.value].forEach((d) => {
      d.checked = false
    })
  } else {
    dong.value[selectGu.value].forEach((d) => {
      d.checked = true
    })
  }
  // 필터링 로직 넣기
}

const clickDong = (idx) => {
  // 체크 박스 연동
  dong.value[selectGu.value][idx].checked =
    !dong.value[selectGu.value][idx].checked
  // 필터링 로직 넣기
}
</script>

<style lang="scss" scoped>
.logo {
  position: fixed;
  top: 102px;
  left: 531px;
  width: 198px;
  height: 198px;
  z-index: 2;
}

.head_panel {
  position: fixed;
  display: flex;
  justify-content: space-between;
  top: 102px;
  left: 71px;
  width: 436px;
  height: 50px;
  padding: 0 26px;
  box-sizing: border-box;
  background: no-repeat;
  background-image: url(../assets/header.svg);
  z-index: 2;
}

.crime_logo {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  z-index: 3;
}

.header_text {
  margin-left: 10px;
  margin-top: 14px;
  line-height: 23px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.body_panel {
  position: fixed;
  top: 205px;
  left: 71px;
  height: 562px;
  width: 436px;
  background: no-repeat;
  background-image: url(../assets/panel.svg);
  padding: 26px 31px;
  z-index: 2;
  box-sizing: border-box;
}

.body_title {
  width: 66px;
  height: 24px;
  margin-bottom: 15px;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  border-radius: 12px;
  background-color: #ffefeb;
  z-index: 3;
}

.select_all {
  display: flex;
}

.checkbox_text {
  margin-left: 6px;
  line-height: 18px;
  color: #ffffff;
  font-size: 12px;
  font-weight: medium;
  text-align: center;
}

.checkboxes {
  display: grid;
  margin-top: 15px;
  grid-template-columns: 78px 78px 78px 78px 78px;
  grid-auto-rows: 18px;
  row-gap: 12px;
}

.checkbox {
  display: flex;
}

.check {
  width: 18px;
  height: 18px;
}

.check:hover {
  cursor: pointer;
}

.street-harrasment {
  position: absolute;
  width: 436px;
  height: 50px;
  background-color: #6d54ce;
  border-style: solid;
  border-width: 2px;
  border-color: #f1cfc8;
  z-index: 2;
}

.article_table {
  display: grid;
  grid-template-columns: 97px 277px;
  grid-auto-rows: 27px;
  align-items: center;
}

.table_position {
  color: #ffefeb;
  font-size: 12px;
  text-align: left;
}

.table_title {
  color: #ffefeb;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.paging {
  margin-top: 20px;
  margin-left: 55px;
  margin-right: 55px;
  width: 263.5px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.paging_numbers {
  display: flex;
  gap: 12px;
}

.paging_number {
  color: #ffefeb;
  font-size: 14px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}

.selected_page {
  background-image: url("../assets/selectedPage.svg");
  background-size: cover;
}

.hover_page {
  background-image: url("../assets/hoverPage.svg");
  background-size: cover;
  color: #4b7de2;
}
</style>
