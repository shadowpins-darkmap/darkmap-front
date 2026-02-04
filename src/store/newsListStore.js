import { defineStore } from 'pinia';
import { ref } from 'vue';
import { articlesApi } from '@/api/articles';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let articlesCache = {
  data: null,
  timestamp: 0,
};

export const useNewsListStore = defineStore('newsListStore', () => {
  const articles = ref([]);
  const filteredArticles = ref([]);
  const sidoCount = ref([]);
  const loading = ref(false);

  const loadArticles = async (forceRefresh = false) => {
    // Check cache first
    const now = Date.now();
    if (
      !forceRefresh &&
      articlesCache.data &&
      now - articlesCache.timestamp < CACHE_DURATION
    ) {
      articles.value = articlesCache.data;
      return;
    }

    loading.value = true;
    try {
      articles.value = await articlesApi.getArticles();
      articles.value.forEach((article) => {
        if (article.category === '') article.category = '기타';
      });

      // Update cache
      articlesCache = {
        data: articles.value,
        timestamp: now,
      };
    } catch (error) {
      console.error('기사 로딩 실패:', error);
      articles.value = [];
    } finally {
      loading.value = false;
    }
  };

  const loadArticlesBySido = async (sido) => {
    loading.value = true;
    try {
      filteredArticles.value = await articlesApi.getArticlesBySido(sido);
    } catch (error) {
      console.error('시도별 기사 로딩 실패:', error);
      filteredArticles.value = [];
    } finally {
      loading.value = false;
    }
  };

  const loadSidoCount = async () => {
    try {
      sidoCount.value = await articlesApi.getArticlesCountBySido();
    } catch (error) {
      console.error('시도별 개수 로딩 실패:', error);
      sidoCount.value = [];
    }
  };

  const createArticles = async (articleData) => {
    try {
      await articlesApi.createArticles(articleData);
      await loadArticles(); // 생성 후 목록 새로고침
    } catch (error) {
      console.error('기사 생성 실패:', error);
      throw error;
    }
  };

  return {
    articles,
    filteredArticles,
    sidoCount,
    loading,
    loadArticles,
    loadArticlesBySido,
    loadSidoCount,
    createArticles,
  };
});
