<template>
  <section class="WorldTourMapPopup">
    <button class="WorldTourMapPopup__close" type="button" @click="closeWindow">
      &times;
    </button>
    <strong class="WorldTourMapPopup__title">{{ country.countryName }}</strong>
    <div class="WorldTourMapPopup__divider" />

    <p class="WorldTourMapPopup__summary">
      There have been
      <strong>{{ pageInfo.totalElements || country.count }}</strong>
      incidents of <span>cyberflashing</span> harassment in this area.
    </p>

    <div class="WorldTourMapPopup__table" :class="{ loading }">
      <div v-if="loading" class="WorldTourMapPopup__empty">Loading...</div>
      <template v-else>
        <a
          v-for="item in rows"
          :key="item.id"
          class="WorldTourMapPopup__row"
          :href="item.url || undefined"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{{ item.date }}</span>
          <strong>{{ item.summary }}</strong>
        </a>
        <div v-if="!rows.length" class="WorldTourMapPopup__empty">
          No cases found.
        </div>
      </template>
    </div>

    <div class="WorldTourMapPopup__paging">
      <button
        type="button"
        :disabled="currentPage <= 1"
        @click="movePage(currentPage - 1)"
      >
        &lsaquo;
      </button>
      <button
        v-for="page in pageNumbers"
        :key="page"
        type="button"
        :class="{ active: page === currentPage }"
        @click="movePage(page)"
      >
        {{ page }}
      </button>
      <button
        type="button"
        :disabled="currentPage >= totalPages"
        @click="movePage(currentPage + 1)"
      >
        &rsaquo;
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useCyberFlashingStore } from '@/store/useCyberFlashingStore';

const props = defineProps({
  country: {
    type: Object,
    required: true,
  },
  closeWindow: {
    type: Function,
    required: true,
  },
});

const cyberFlashingStore = useCyberFlashingStore();
const rows = ref([]);
const pageInfo = ref({
  currentPage: 1,
  pageSize: 5,
  totalElements: props.country.count,
  totalPages: Math.max(1, Math.ceil(props.country.count / 5)),
});
const loading = ref(false);

const currentPage = computed(() => pageInfo.value.currentPage || 1);
const totalPages = computed(() => Math.max(1, pageInfo.value.totalPages || 1));
const pageNumbers = computed(() => {
  const start = Math.floor((currentPage.value - 1) / 5) * 5 + 1;
  const end = Math.min(start + 4, totalPages.value);
  return Array(end - start + 1)
    .fill(null)
    .map((_, index) => start + index);
});

const movePage = async (page) => {
  if (page < 1 || page > totalPages.value || loading.value) return;
  loading.value = true;
  try {
    const data = await cyberFlashingStore.fetchCountryCases(
      props.country.code,
      page,
      5,
    );
    rows.value = data.items;
    pageInfo.value = data.pageInfo;
  } catch (error) {
    console.error('국가별 사이버플래싱 사례 로딩 실패:', error);
    rows.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  movePage(1);
});
</script>

<style scoped lang="scss">
.WorldTourMapPopup {
  position: relative;
  width: min(520px, calc(100vw - 48px));
  padding: 42px 18px 22px;
  border: 2px solid #4c527c;
  border-radius: 4px;
  background: #303556;
  color: #fff5f3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}

.WorldTourMapPopup::after {
  content: '';
  position: absolute;
  left: 46%;
  bottom: -36px;
  width: 56px;
  height: 36px;
  background: #303556;
  border-left: 2px solid #4c527c;
  border-bottom: 2px solid #4c527c;
  clip-path: polygon(0 0, 55% 0, 0 100%);
}

.WorldTourMapPopup__close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #fff5f3;
  font-size: 42px;
  line-height: 24px;
  font-weight: 200;
}

.WorldTourMapPopup__title {
  display: block;
  padding-right: 44px;
  font-size: 22px;
  line-height: 1;
  font-weight: 700;
}

.WorldTourMapPopup__divider {
  height: 2px;
  margin: 18px 0 34px;
  background: #555b85;
}

.WorldTourMapPopup__summary {
  margin: 0 0 28px;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 700;
}

.WorldTourMapPopup__summary span {
  display: inline-block;
  border-bottom: 7px solid #ff7272;
  line-height: 0.72;
}

.WorldTourMapPopup__table {
  min-height: 176px;
  border-top: 3px solid #00e6c4;
}

.WorldTourMapPopup__row {
  display: grid;
  grid-template-columns: 112px 1fr;
  min-height: 35px;
  align-items: center;
  border-bottom: 2px solid #00e6c4;
  color: #fff5f3;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.3;
}

.WorldTourMapPopup__row span {
  font-weight: 700;
}

.WorldTourMapPopup__row strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.WorldTourMapPopup__empty {
  padding: 22px 0;
  color: #dce4ff;
  font-size: 14px;
}

.WorldTourMapPopup__paging {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  margin-top: 24px;
}

.WorldTourMapPopup__paging button {
  min-width: 34px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #dce4ff;
  font-size: 18px;
}

.WorldTourMapPopup__paging button.active {
  background: #4d80e6;
  color: #fff;
}

.WorldTourMapPopup__paging button:disabled {
  opacity: 0.35;
}
</style>
