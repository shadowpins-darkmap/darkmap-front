<template>
  <div class="ControlMobile">
    <div class="ControlMobile__header">
      <img width="60" height="60" src="../assets/logo.svg" />
      <div class="ControlMobile__guide">
        테마와 지역을 선택 후 어떤 길거리 괴롭힘이 일어나고 있는지 살펴보세요
      </div>
    </div>
    <div class="ControlMobile__banner">모바일 지도는 준비중입니다</div>
    <div class="ControlMobile__body">
      <div class="ControlMobile__section">
        <div class="ControlMobile__body-title">테마 투어</div>
      </div>
      <div class="ControlMobile__select-all">
        <div @click="clickAllCrime">
          <img
            v-if="allCrimeChecked"
            class="ControlMobile__check"
            src="../assets/checkbox.svg"
          />
          <img
            v-if="!allCrimeChecked"
            class="ControlMobile__check"
            src="../assets/unchecked.svg"
          />
        </div>
        <div class="ControlMobile__checkbox-text">길거리 괴롭힘 전체</div>
      </div>
      <div class="ControlMobile__checkboxes">
        <div
          class="ControlMobile__checkbox"
          v-for="(c, idx) in crimeTypes"
          v-bind:key="idx"
        >
          <div @click="clickCrimeType(idx)">
            <img
              v-if="c.checked"
              class="ControlMobile__check"
              src="../assets/checkbox.svg"
            />
            <img
              v-if="!c.checked"
              class="ControlMobile__check"
              src="../assets/unchecked.svg"
            />
          </div>
          <div class="ControlMobile__checkbox-text">{{ c.crimeType }}</div>
        </div>
      </div>
      <div class="ControlMobile__section">
        <div class="ControlMobile__body-title">지역 투어</div>
        <address-filter
          :address-data="addressData"
          @change="changeGu"
        ></address-filter>
      </div>
      <div class="ControlMobile__select-all">
        <div @click="clickAllDong">
          <img
            v-if="allDongChecked"
            class="ControlMobile__check"
            src="../assets/checkbox.svg"
          />
          <img
            v-if="!allDongChecked"
            class="ControlMobile__check"
            src="../assets/unchecked.svg"
          />
        </div>
        <div class="ControlMobile__checkbox-text">{{ selectGu }} 전체</div>
      </div>
      <div class="ControlMobile__checkboxes">
        <div
          class="ControlMobile__checkbox"
          v-for="(d, idx) in dongList"
          v-bind:key="idx"
        >
          <div @click="clickDong(idx)">
            <img
              v-if="d.checked"
              class="ControlMobile__check"
              src="../assets/checkbox.svg"
            />
            <img
              v-if="!d.checked"
              class="ControlMobile__check"
              src="../assets/unchecked.svg"
            />
          </div>
          <div class="ControlMobile__checkbox-text">{{ d.name }}</div>
        </div>
      </div>
      <div class="ControlMobile__body-title ControlMobile__section">
        뉴스 투어
      </div>
      <div class="ControlMobile__articleTable">
        <div
          v-for="(tArticle, i) in tableArticles"
          :key="i"
          class="ControlMobile__articleTable--item"
        >
          <div class="ControlMobile__table-position">
            {{ tArticle.address || '-' }}
          </div>
          <div
            class="ControlMobile__table-title"
            @click="clickTitle(tArticle.url)"
          >
            {{ tArticle.title || '-' }}
          </div>
        </div>
      </div>
      <div class="ControlMobile__paging">
        <div class="ControlMobile__prev-next" @click="clickPrev">
          <img style="width: 4px" src="../assets/leftArrow.svg" />
        </div>
        <div class="ControlMobile__paging-numbers">
          <div
            v-for="page in pageNumbers"
            :key="page"
            @click="pageChange(page)"
            :class="{
              'ControlMobile__paging-number--selected': page === currentPage,
            }"
            class="ControlMobile__paging-number"
          >
            {{ page }}
          </div>
        </div>
        <div class="ControlMobile__prev-next" @click="clickNext">
          <img style="width: 4px" src="../assets/rightArrow.svg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNewsListStore } from '@/store/newsListStore';
import { storeToRefs } from 'pinia';
import AddressFilter from './AddressFilter.vue';
import addressData from '@/constant/addresses.json';
import { ref, computed, defineEmits, watch, onMounted } from 'vue';

const emits = defineEmits(['changeFilter']);
const { loadArticles } = useNewsListStore();

onMounted(async () => {
  await loadArticles();
  initPage();
});

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
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

.ControlMobile {
  background: #000000;
  box-sizing: border-box;

  &__header {
    padding: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 10px;
  }

  &__guide {
    padding: 20px;
    background-color: #00ffc2;
  }

  &__banner {
    text-align: center;
    background-color: #6d54ce;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    padding: 14px;
  }

  &__body {
    padding: 0 20px;
  }

  &__body-title {
    width: 66px;
    height: 12px;
    padding: 10px 8px;
    text-align: center;
    line-height: 14px;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    border-radius: 12px;
    background-color: #ffefeb;
    z-index: 3;
  }

  &__section {
    display: flex;
    margin: 32px 0 16px 0;
  }

  &__select-all {
    display: flex;
  }

  &__checkbox-text {
    margin-left: 6px;
    line-height: 18px;
    color: #ffffff;
    font-size: 12px;
    font-weight: medium;
    word-break: keep-all;
    text-align: left;
  }

  &__checkboxes {
    display: grid;
    margin-top: 15px;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 12px;
    column-gap: 12px;
  }

  &__checkbox {
    display: flex;
  }

  &__check {
    width: 18px;
    height: 18px;

    &:hover {
      cursor: pointer;
    }
  }

  &__articleTable {
    border-top: 1px solid #00ffc2;
    border-bottom: 1px solid #00ffc2;

    &--item {
      display: grid;
      grid-template-columns: 97px 1fr;
      grid-auto-rows: 27px;
      align-items: center;
      & + & {
        border-top: 1px solid #00ffc2;
      }
    }
  }

  &__table-position {
    color: #ffefeb;
    font-size: 12px;
    text-align: left;
  }

  &__table-title {
    color: #ffefeb;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;

    &:hover {
      cursor: pointer;
      text-decoration-line: underline;
      font-weight: bold;
    }
  }

  &__paging {
    padding: 26px 55px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__paging-numbers {
    display: flex;
    gap: 12px;
    margin: 0 30px;
  }

  &__paging-number {
    color: #ffefeb;
    font-size: 14px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;

    &:hover {
      cursor: pointer;
      background-image: url('../assets/hoverPage.svg');
      background-size: cover;
      color: #4b7de2;
    }

    &--selected {
      background-image: url('../assets/selectedPage.svg');
      background-size: cover;
    }
  }

  &__prev-next {
    width: 4px;

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
