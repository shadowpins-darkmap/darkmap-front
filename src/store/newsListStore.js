import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useNewsListStore = defineStore('counter', () => {
  const articles = ref([]);
  const filteredArticles = ref([]);

  const loadArticles = async () => {
    const url = process.env.VUE_APP_DB_SERVER + '/articles';
    const res = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    articles.value = res.data;
    articles.value.forEach((article) => {
      if (article.category === '') article.category = '기타';
    });
  };

  return {
    articles,
    filteredArticles,
    loadArticles,
  };
});
