<template>
  <div class="popup_wrap">
    <!-- 로고 영역 -->
    <div class="logo">
      <img
        width="150px"
        height="150px"
        alt="다크맵 투어 로고"
        src="../assets/logo.svg"
      />
    </div>

    <!-- 검색 영역  -->
    <div class="search_wrap">
      <button class="report_guide_button" @click="showReportGuide = true">
        <img
          width="80px"
          height="80px"
          alt="신고 버튼 아이콘"
          src="../assets/reportButton.svg"
        />
      </button>
      <button class="search_button" @click="isListPanelOpen = true">
        <img
          width="24px"
          height="24px"
          alt="검색 아이콘"
          src="../assets/mainSearchIcon.svg"
        />
        <span class="search_button_text"
          >내가 사는 동네에서 일어난 괴롭힘 사건을 한 번 알아보세요.</span
        >
      </button>
    </div>
    <!-- 컨텐츠 솔팅  -->
    <div class="head_panel">
      <button class="panel_item" @click="clickCrimeLogo(0)">
        <span class="crime_logo" style="background: #ffa8a8">
          <img src="../assets/flasherLogo.svg" />
        </span>
        <span class="panel_item_text">바바리맨</span>
      </button>
      <button class="panel_item" @click="clickCrimeLogo(1)">
        <span class="crime_logo" style="background: #1cd6ff">
          <img src="../assets/huntingLogo2.svg" />
        </span>
        <span class="panel_item_text">헌팅</span>
      </button>
      <button class="panel_item" @click="clickCrimeLogo(2)">
        <span class="crime_logo" style="background: #b56bff">
          <img src="../assets/chasingLogo2.svg" />
        </span>
        <span class="panel_item_text">미행</span>
      </button>
      <button class="panel_item" @click="clickCrimeLogo(3)">
        <span class="crime_logo" style="background: #ffed89">
          <img src="../assets/assaultLogo.svg" />
        </span>
        <span class="panel_item_text">폭행</span>
      </button>
    </div>
    <div class="scroll_area_wrap body_panel_wrap">
      <div class="body_panel scroll_area">
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
            <span class="checkbox_wrap" @click="clickCrimeType(idx)">
              <img
                v-if="c.checked"
                class="check"
                src="../assets/checkbox.svg"
              />
              <img
                v-if="!c.checked"
                class="check"
                src="../assets/unchecked.svg"
              />
            </span>
            <div class="checkbox_text">{{ c.crimeType }}</div>
          </div>
        </div>
        <div class="body_title_wrap">
          <strong class="body_title"><span>지역 투어</span></strong>
          <AddressFilter :addressData="addressData" @change="changeGu" />
        </div>
        <div class="select_all">
          <div @click="clickAllDong">
            <img
              v-if="allDongChecked"
              class="check"
              src="../assets/checkbox.svg"
            />
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
              <img
                v-if="d.checked"
                class="check"
                src="../assets/checkbox.svg"
              />
              <img
                v-if="!d.checked"
                class="check"
                src="../assets/unchecked.svg"
              />
            </div>
            <div class="checkbox_text">{{ d.name }}</div>
          </div>
        </div>
        <div class="body_title_wrap">
          <strong class="body_title"><span>뉴스 투어</span></strong>
        </div>
        <div style="border: 0; height: 1.5px; background: #00ffc2"></div>
        <div
          v-for="(tArticle, i) in tableArticles"
          :key="i"
          class="article_table"
        >
          <div class="table_position">
            {{ tArticle.address || '-' }}
          </div>
          <div class="table_title" @click="clickTitle(tArticle.url)">
            {{ tArticle.title || '-' }}
          </div>
        </div>
        <div style="border: 0; height: 1.5px; background: #00ffc2" />
        <div class="paging">
          <button class="prev_next" @click="clickPrev">
            <img style="width: 10px" src="../assets/leftArrow.svg" />
          </button>
          <div class="paging_numbers">
            <span
              v-for="page in pageNumbers"
              :key="page"
              @click="pageChange(page)"
              :class="{ selected_page: page === currentPage }"
              class="paging_number"
            >
              {{ page }}
            </span>
          </div>
          <button class="prev_next" @click="clickNext">
            <img style="width: 10px" src="../assets/rightArrow.svg" />
          </button>
        </div>
        <div class="footer">
          <BaseFooter />
        </div>
      </div>
    </div>
  </div>
  <!-- 검색창 SlidePanel -->
  <SlidePanel
    :width="'510px'"
    :visible="isListPanelOpen"
    @close="isListPanelOpen = false"
    :right="'auto'"
    :left="'0'"
  >
    <SearchListPanel @close="handleListPanelClose" />
  </SlidePanel>
  <!-- 팝업 -->
  <ReportGuidePopup v-if="showReportGuide" @close="showReportGuide = false" />
</template>

<script setup>
import { useNewsListStore } from '@/store/newsListStore';
import { storeToRefs } from 'pinia';
import AddressFilter from './AddressFilter.vue';
import addressData from '@/constant/addresses.json';
import '@/styles/ControlPopup.scss';
import { ref, computed, defineEmits, watch } from 'vue';
import BaseFooter from '@/components/BaseFooter.vue';
import ReportGuidePopup from '@/components/searchArea/ReportGuidePopup.vue';
import SlidePanel from '@/components/slidePanel/SlidePanel.vue';
import SearchListPanel from '@/components/searchArea/SearchListPanel.vue';

const showReportGuide = ref(false);
const isListPanelOpen = ref(false);

const handleListPanelClose = () => {
  isListPanelOpen.value = false;
};

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

const clickCrimeLogo = (idx) => {
  for (let i = 0; i < crimeTypes.value.length; i++) {
    crimeTypes.value[i].checked = idx === i;
  }
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

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
