import api from '@/lib/api';

const ENDPOINT = '/api/v1/cyber-flashing/cases';

const unwrap = (response) => response?.data?.data ?? response?.data;

export const cyberFlashingApi = {
  async getCases(params = {}) {
    const response = await api.get(ENDPOINT, { params });
    return unwrap(response);
  },

  async getCount(params = {}) {
    const response = await api.get(`${ENDPOINT}/count`, { params });
    return unwrap(response);
  },
};
