<template>
  <div class="logo">
    <img width="198px" height="198px" src="../assets/logo.svg" />
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
    <strong class="body_title"><span>테마 투어</span></strong>
    <div class="select_all">
      <div @click="clickAllCrime">
        <img
          v-if="allCrimeChecked"
          class="check"
          src="../assets/checkbox.svg"
        />
        <img
          v-if="!allCrimeChecked"
          class="check"
          src="../assets/unchecked.svg"
        />
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
    <div style="display: flex; margin-top: 32px">
      <strong class="body_title"><span>지역 투어</span></strong>
      <AddressFilter :addressData="addressData" @change="changeGu" />
    </div>
    <div class="select_all">
      <div @click="clickAllDong">
        <img v-if="allDongChecked" class="check" src="../assets/checkbox.svg" />
        <img
          v-if="!allDongChecked"
          class="check"
          src="../assets/unchecked.svg"
        />
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
    <strong class="body_title" style="margin-top: 32px"
      ><span>뉴스 투어</span></strong
    >
    <div
      style="border: 0; height: 1.5px; background: #00ffc2; margin-top: 20px"
    ></div>
    <div v-for="(tArticle, i) in tableArticles" :key="i" class="article_table">
      <div class="table_position">
        {{ tArticle.address || '-' }}
      </div>
      <div class="table_title" @click="clickTitle(tArticle.url)">
        {{ tArticle.title || '-' }}
      </div>
    </div>
    <div style="border: 0; height: 1.5px; background: #00ffc2" />
    <div class="paging">
      <div class="prev_next" @click="clickPrev">
        <img style="width: 4px" src="../assets/leftArrow.svg" />
      </div>
      <div class="paging_numbers" style="margin: 0 30px">
        <div
          v-for="page in pageNumbers"
          :key="page"
          @click="pageChange(page)"
          :class="{ selected_page: page === currentPage }"
          class="paging_number"
        >
          {{ page }}
        </div>
      </div>
      <div class="prev_next" @click="clickNext">
        <img style="width: 4px" src="../assets/rightArrow.svg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNewsListStore } from '@/store/newsListStore';
import { storeToRefs } from 'pinia';
import AddressFilter from './AddressFilter.vue';
import addressData from '@/constant/addresses.json';
import '@/styles/ControlPopup.scss';
import { ref, computed, defineEmits, watch } from 'vue';

const emits = defineEmits(['changeFilter']);

const clickTitle = (url) => {
  window.open(url, '_blank');
};

const { filteredArticles } = storeToRefs(useNewsListStore());

const tableArticles = ref([
  { title: '', address: '', url: '' },
  { title: '', address: '', url: '' },
  { title: '', address: '', url: '' },
  { title: '', address: '', url: '' },
]);
const pageNumbers = ref([1]);
const totalPages = computed(
  () => parseInt(filteredArticles.value.length / 4) + 1,
);
const currentPage = ref(1);

watch(filteredArticles, () => {
  initPage();
});

const pageChange = (p) => {
  currentPage.value = p;

  // tableArticles를 현재 페이지에 맞춰서 변경
  for (let i = 0; i < 4; i++) {
    if ((p - 1) * 4 + i < filteredArticles.value.length) {
      const tableArticle = filteredArticles.value[(p - 1) * 4 + i];
      const address = tableArticle.address.split(' ').slice(0, 2).join(' ');
      tableArticles.value[i] = {
        title: tableArticle.title,
        address: address,
        url: tableArticle.url,
      };
    } else {
      tableArticles.value[i] = { title: '-', address: '-', url: '-' };
    }
  }
};

const chagnePageNumbers = () => {
  if (totalPages.value >= currentPage.value + 4) {
    pageNumbers.value = Array(5)
      .fill()
      .map((v, i) => currentPage.value + i);
  } else {
    pageNumbers.value = Array(totalPages.value - currentPage.value + 1)
      .fill()
      .map((v, i) => currentPage.value + i);
  }
};

const initPage = () => {
  pageChange(1);
  chagnePageNumbers();
};

const clickPrev = () => {
  // 이전 클릭 불가능 시 바로 return
  if (parseInt((currentPage.value - 1) / 5) === 0) {
    return;
  }

  // 이전 버튼 클릭
  pageChange(parseInt((currentPage.value - 6) / 5) * 5 + 1);
  chagnePageNumbers();
};

const clickNext = () => {
  //다음 클릭 불가능 시 바로 return
  if (
    parseInt((currentPage.value - 1) / 5) ===
    parseInt((totalPages.value - 1) / 5)
  ) {
    return;
  }

  // 다음 버튼 클릭
  pageChange(parseInt((currentPage.value + 4) / 5) * 5 + 1);
  chagnePageNumbers();
};

const crimeTypes = ref([
  {
    crimeType: '바바리맨',
    checked: true,
  },
  {
    crimeType: '헌팅',
    checked: true,
  },
  {
    crimeType: '미행',
    checked: true,
  },
  {
    crimeType: '폭행',
    checked: true,
  },
]);

const allCrimeChecked = computed(() => {
  return crimeTypes.value.filter(({ checked }) => checked).length === 4;
});

const clickAllCrime = () => {
  if (allCrimeChecked.value) {
    crimeTypes.value.forEach((c) => {
      c.checked = false;
    });
  } else {
    crimeTypes.value.forEach((c) => {
      c.checked = true;
    });
  }
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

const clickCrimeType = (idx) => {
  // 체크 박스 연동
  crimeTypes.value[idx].checked = !crimeTypes.value[idx].checked;
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

// Address handling
const selectGu = ref(addressData[0].lv1);
const dongList = ref([]);

// Initialize dongList with checked property
const initializeDongList = (lv1) => {
  const selectedAddress = addressData.find((addr) => addr.lv1 === lv1);
  if (selectedAddress) {
    dongList.value = selectedAddress.lv2.map((dong) => ({
      name: dong,
      checked: true,
    }));
  }
};

// Initialize dongList with first lv1
initializeDongList(selectGu.value);

const changeGu = (newGu) => {
  // Changed to receive single parameter
  selectGu.value = newGu;
  initializeDongList(newGu);
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

const allDongChecked = computed(() => {
  return dongList.value.every((dong) => dong.checked);
});

const clickAllDong = () => {
  const newCheckedState = !allDongChecked.value;
  dongList.value.forEach((dong) => {
    dong.checked = newCheckedState;
  });
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

const clickDong = (idx) => {
  dongList.value[idx].checked = !dongList.value[idx].checked;
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};
</script>
