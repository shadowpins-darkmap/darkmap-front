import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { cyberFlashingApi } from '@/api/cyberFlashing';
import { getWorldCapital } from '@/constant/worldCapitals';

const PAGE_SIZE = 100;
const INCLUDE_FLAG = '포함';
const dateFormatter = /^(\d{4})(\d{2})(\d{2})$/;

const formatDate = (value) => {
  const match = String(value || '').match(dateFormatter);
  if (!match) return value || '-';
  return `${match[1]}.${Number(match[2])}.${Number(match[3])}`;
};

const normalizeCase = (item) => ({
  id: item.id,
  countryCode: item.countryCode,
  date: formatDate(item.occurredDate),
  summary: item.articleTitle || item.content || 'Untitled case',
  title: item.articleTitle || item.content || 'Untitled case',
  url: item.url || '',
  occurredDate: item.occurredDate || '',
  press: item.press || '',
});

export const useCyberFlashingStore = defineStore('cyberFlashingStore', () => {
  const cases = ref([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref(null);
  const loaded = ref(false);
  const countryPageCache = ref({});

  const countrySummaries = computed(() => {
    const grouped = new Map();

    cases.value.forEach((item) => {
      if (!item.countryCode) return;
      const code = item.countryCode.toUpperCase();
      const capital = getWorldCapital(code);
      const current = grouped.get(code) || {
        ...capital,
        count: 0,
        cases: [],
      };

      current.count += 1;
      current.cases.push(item);
      grouped.set(code, current);
    });

    return [...grouped.values()]
      .filter(({ lat, lng }) => Number.isFinite(lat) && Number.isFinite(lng))
      .sort((a, b) => b.count - a.count || a.countryName.localeCompare(b.countryName));
  });

  const countryNames = computed(() =>
    countrySummaries.value.map(({ countryName }) => countryName),
  );

  const casesByCountryName = computed(() => {
    return countrySummaries.value.reduce((acc, country) => {
      acc[country.countryName] = country.cases;
      return acc;
    }, {});
  });

  const fetchAllCases = async (forceRefresh = false) => {
    if (loaded.value && !forceRefresh) return;

    loading.value = true;
    error.value = null;

    try {
      totalCount.value = await cyberFlashingApi.getCount({
        includeFlag: INCLUDE_FLAG,
      });

      const totalPages = Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE));
      const requests = Array(totalPages)
        .fill(null)
        .map((_, index) =>
          cyberFlashingApi.getCases({
            includeFlag: INCLUDE_FLAG,
            page: index + 1,
            size: PAGE_SIZE,
          }),
        );

      const pages = await Promise.all(requests);
      cases.value = pages.flatMap((page) => page.items || []).map(normalizeCase);
      loaded.value = true;
    } catch (fetchError) {
      console.error('사이버플래싱 사례 로딩 실패:', fetchError);
      error.value = fetchError;
      cases.value = [];
      totalCount.value = 0;
    } finally {
      loading.value = false;
    }
  };

  const fetchCountryCases = async (countryCode, page = 1, size = 5) => {
    const code = String(countryCode || '').toUpperCase();
    const cacheKey = `${code}:${page}:${size}`;
    if (countryPageCache.value[cacheKey]) {
      return countryPageCache.value[cacheKey];
    }

    const response = await cyberFlashingApi.getCases({
      countryCode: code,
      includeFlag: INCLUDE_FLAG,
      page,
      size,
    });
    const data = {
      items: (response.items || []).map(normalizeCase),
      pageInfo: response.pageInfo || {
        currentPage: page,
        pageSize: size,
        totalElements: 0,
        totalPages: 1,
      },
    };

    countryPageCache.value = {
      ...countryPageCache.value,
      [cacheKey]: data,
    };

    return data;
  };

  return {
    cases,
    totalCount,
    loading,
    error,
    loaded,
    countrySummaries,
    countryNames,
    casesByCountryName,
    fetchAllCases,
    fetchCountryCases,
  };
});
