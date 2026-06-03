import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { crimeCasesApi } from '@/api/crimeCases';

const unwrapItems = (response) => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.boards)) return data.boards;
  return [];
};

const normalizeCrimeType = (value) => {
  if (!value) return '기타';
  if (typeof value === 'string') return value;
  return value.label || value.name || value.value || '기타';
};

const normalizePosition = (item) => {
  const lat = Number(item.latitude ?? item.lat ?? item.position?.lat);
  const lng = Number(item.longitude ?? item.lng ?? item.position?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
};

const normalizeExperienceCase = (item) => {
  const crimeType = normalizeCrimeType(item.crimeType || item.category || item.tag);
  const sido = item.sido || item.region1 || item.address?.split(' ')?.[0] || '';
  const sigungu = item.sigungu || item.region2 || item.address?.split(' ')?.[1] || '';
  const reporterNickname =
    item.reporterNickname ??
    item.reporterDisplayId ??
    item.authorNickname ??
    item.memberNickname ??
    item.userNickname ??
    item.writerNickname ??
    item.nickname ??
    item.displayName ??
    item.reporterId ??
    item.memberId ??
    item.userId ??
    item.writerId;
  const title =
    item.title ||
    item.articleTitle ||
    item.subject ||
    item.summary ||
    item.content ||
    '제보 경험담';

  return {
    id: item.id ?? item.boardId ?? item.caseId ?? `${reporterNickname || 'unknown'}-${title}`,
    title,
    content: item.content || item.body || item.description || '',
    reporterId: item.reporterId,
    reporterNickname: reporterNickname ? String(reporterNickname) : '익명',
    address: item.address || [sido, sigungu].filter(Boolean).join(' ') || '경험담',
    category: crimeType,
    sido,
    sigungu,
    url: item.url || item.newsUrl || '',
    position: normalizePosition(item),
    raw: item,
  };
};

const fetchAllKoreanExperiences = async () => {
  const size = 100;
  let page = 1;
  let hasNext = true;
  const items = [];

  while (hasNext) {
    const response = await crimeCasesApi.getKoreanExperiences({ page, size });
    const pageItems = unwrapItems(response);
    const pageInfo = response?.data?.pageInfo || response?.pageInfo || {};

    items.push(...pageItems);
    hasNext = Boolean(pageInfo.hasNext);
    page += 1;

    if (!pageInfo.hasNext && pageInfo.totalPages && page <= pageInfo.totalPages) {
      hasNext = true;
    }
  }

  return items;
};

export const useCaseTourStore = defineStore('caseTour', () => {
  const mode = ref('news');
  const experienceCases = ref([]);
  const loading = ref(false);
  const loaded = ref(false);
  let loadingPromise = null;

  const isNewsMode = computed(() => mode.value === 'news');
  const isExperienceMode = computed(() => mode.value === 'experience');

  const setMode = (nextMode) => {
    if (nextMode !== 'news' && nextMode !== 'experience') return;
    mode.value = nextMode;
  };

  const toggleMode = () => {
    mode.value = mode.value === 'news' ? 'experience' : 'news';
  };

  const loadExperienceCases = async (forceRefresh = false) => {
    if (!forceRefresh && loaded.value) return experienceCases.value;
    if (!forceRefresh && loadingPromise) return loadingPromise;

    loading.value = true;
    loadingPromise = (async () => {
      let didLoad = false;
      try {
        const items = await fetchAllKoreanExperiences();
        experienceCases.value = items.map(normalizeExperienceCase);
        didLoad = true;
      } catch (error) {
        console.error('국문 경험담 로딩 실패:', error);
        experienceCases.value = [];
      } finally {
        loaded.value = didLoad;
        loading.value = false;
        loadingPromise = null;
      }
      return experienceCases.value;
    })();

    return loadingPromise;
  };

  return {
    mode,
    experienceCases,
    loading,
    loaded,
    isNewsMode,
    isExperienceMode,
    setMode,
    toggleMode,
    loadExperienceCases,
  };
});
