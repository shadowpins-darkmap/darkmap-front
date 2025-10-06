import api from '@/lib/api';

export const articlesApi = {
  async getArticles() {
    const { data } = await api.get('/articles');
    return data;
  },

  async createArticles(articles) {
    const { data } = await api.post('/articles', articles);
    return data;
  },

  async getArticlesBySido(sido) {
    const { data } = await api.get('/articles/sido', {
      params: { sido },
    });
    return data;
  },

  async getArticlesCountBySido() {
    const { data } = await api.get('/articles/sido/count');
    return data;
  },
};
