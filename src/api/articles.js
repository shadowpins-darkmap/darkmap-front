import api from '@/lib/api';
import { DEFAULT_API_URL } from '@/constant/url';

export const articlesApi = {
  async getArticles() {
    const { data } = await api.get(`${DEFAULT_API_URL}/articles`);
    return data;
  },

  async createArticles(articles) {
    const { data } = await api.post(`${DEFAULT_API_URL}/articles`, articles);
    return data;
  },

  async getArticlesBySido(sido) {
    const { data } = await api.get(`${DEFAULT_API_URL}/articles/sido`, {
      params: { sido },
    });
    return data;
  },

  async getArticlesCountBySido() {
    const { data } = await api.get(`${DEFAULT_API_URL}/articles/sido/count`);
    return data;
  },
};
