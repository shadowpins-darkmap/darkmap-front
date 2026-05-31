import api from '@/lib/api';

export const crimeCasesApi = {
  async getCrimeCases(params = {}) {
    const { data } = await api.get('/api/v1/crime-cases', { params });
    return data;
  },
};
