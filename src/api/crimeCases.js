import api from '@/lib/api';

export const crimeCasesApi = {
  async getKoreanExperiences(params = {}) {
    const { data } = await api.get('/api/v1/crime-cases/experiences', {
      params,
    });
    return data;
  },
};
