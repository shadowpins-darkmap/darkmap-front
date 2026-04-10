<template>
  <div class="popup_wrap">
    <div class="logo">
      <img
        :alt="t('logo.alt')"
        :src="
          tourModeStore.isWorldTour
            ? require('../assets/worldtour-logo.svg')
            : require('../assets/logo.svg')
        "
      />
      <TourModeToggle />
    </div>

    <div class="search_wrap" :class="{ 'world-mode': tourModeStore.isWorldTour }">
      <button
        v-if="tourModeStore.isKoreaTour"
        class="report_guide_button"
        @click="showReportGuide = true"
      >
        <img
          width="53"
          height="53"
          alt="신고 버튼 아이콘"
          src="../assets/reportButton.svg"
        />
      </button>
      <button class="search_button" @click="isListPanelOpen = true">
        <img
          width="18"
          height="18"
          alt="검색 아이콘"
          src="../assets/mainSearchIcon.svg"
        />
        <span class="search_button_text">{{ t('search.placeholder') }}</span>
      </button>
    </div>

    <div class="head_panel" v-if="tourModeStore.isKoreaTour">
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
    <div v-else class="cyber_flashing_banner">
      <span class="crime_logo" style="background: #ffa8a8">
        <img src="../assets/flasherLogo.svg" alt="cyber flashing" />
      </span>
      <span>{{ t('cyberFlashing.banner') }}</span>
    </div>

    <div class="scroll_area_wrap body_panel_wrap">
      <div class="body_panel scroll_area">
        <template v-if="tourModeStore.isKoreaTour">
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
            <div class="checkbox" v-for="(c, idx) in crimeTypes" :key="idx">
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
            <div class="checkbox" v-for="(d, idx) in dongList" :key="idx">
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
              <div
                class="checkbox_text"
                :class="{ 'long-name': d.name.length > 4 }"
              >
                {{ d.name }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="body_title_wrap">
            <strong class="body_title"><span>{{ t('countries.label') }}</span></strong>
            <BaseDropdown
              :list="worldCountries"
              :selected="selectedCountry"
              :onSelect="changeCountry"
            />
          </div>
        </template>

        <div class="body_title_wrap">
          <strong class="body_title"
            ><span>{{
              tourModeStore.isKoreaTour ? '뉴스 투어' : 'Cyber Flashing Cases'
            }}</span></strong
          >
        </div>
        <div class="news_table_wrap">
          <div class="news_table_line top"></div>
          <div v-for="(row, i) in currentRows" :key="i" class="article_table">
            <div class="table_position">{{ row.address || row.date || '-' }}</div>
            <div
              class="table_title"
              @click="row.url ? clickTitle(row.url) : undefined"
            >
              {{ row.title || row.summary || '-' }}
            </div>
          </div>
          <div class="news_table_line bottom"></div>
        </div>
        <div class="paging">
          <button class="prev_next" @click="clickPrev">
            <img style="width: 5px" src="../assets/leftArrow.svg" />
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
            <img style="width: 5px" src="../assets/rightArrow.svg" />
          </button>
        </div>
        <div class="footer">
          <BaseFooter :is-world-tour="tourModeStore.isWorldTour" />
        </div>
      </div>
    </div>
  </div>
  <SlidePanel
    :width="'510px'"
    :visible="isListPanelOpen"
    @close="isListPanelOpen = false"
    :right="'auto'"
    :left="'0'"
  >
    <SearchListPanel @close="handleListPanelClose" />
  </SlidePanel>
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
import BaseDropdown from './BaseDropdown.vue';
import TourModeToggle from './TourModeToggle.vue';
import { useTourModeStore } from '@/store/useTourModeStore';
import { useTranslation } from '@/composables/useTranslation';
import { cyberFlashingCases, worldCountries } from '@/constant/worldTourData';

const showReportGuide = ref(false);
const isListPanelOpen = ref(false);
const selectedCountry = ref(worldCountries[0]);
const tourModeStore = useTourModeStore();
const { t } = useTranslation();

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
const currentPage = ref(1);
const pageNumbers = ref([1]);

const worldRows = computed(
  () => cyberFlashingCases[selectedCountry.value] || cyberFlashingCases.England,
);

const rowSource = computed(() => {
  return tourModeStore.isKoreaTour ? filteredArticles.value : worldRows.value;
});

const totalPages = computed(() => {
  const pageCount = Math.ceil(rowSource.value.length / 4);
  return pageCount > 0 ? pageCount : 1;
});

watch(filteredArticles, () => {
  if (tourModeStore.isKoreaTour) {
    initPage();
  }
});
watch(
  () => tourModeStore.mode,
  () => {
    initPage();
  },
);
watch(selectedCountry, () => {
  if (tourModeStore.isWorldTour) {
    initPage();
  }
});

const pageChange = (p) => {
  currentPage.value = p;

  for (let i = 0; i < 4; i++) {
    if ((p - 1) * 4 + i < rowSource.value.length) {
      const row = rowSource.value[(p - 1) * 4 + i];
      if (tourModeStore.isKoreaTour) {
        const address = row.address.split(' ').slice(0, 2).join(' ');
        tableArticles.value[i] = {
          title: row.title,
          address,
          url: row.url,
        };
      } else {
        tableArticles.value[i] = {
          date: row.date,
          summary: row.summary,
          url: '',
        };
      }
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

const changeCountry = (country) => {
  selectedCountry.value = country;
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
  if (tourModeStore.isWorldTour) return;
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
  if (tourModeStore.isWorldTour) return;
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
  if (tourModeStore.isWorldTour) return;
  for (let i = 0; i < crimeTypes.value.length; i++) {
    crimeTypes.value[i].checked = idx === i;
  }
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

const clickAllDong = () => {
  if (tourModeStore.isWorldTour) return;
  const newCheckedState = !allDongChecked.value;
  dongList.value.forEach((dong) => {
    dong.checked = newCheckedState;
  });
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

const clickDong = (idx) => {
  if (tourModeStore.isWorldTour) return;
  dongList.value[idx].checked = !dongList.value[idx].checked;
  // 필터링 로직 넣기
  emits('changeFilter', crimeTypes.value, selectGu.value, dongList.value);
};

const currentRows = computed(() => tableArticles.value);

initPage();
</script>
