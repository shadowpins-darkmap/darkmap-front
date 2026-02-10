import api from '@/lib/api';

export const userApi = {
  async getMe() {
    const { data } = await api.get('/api/v1/member/me');
    return data;
  },

  async getProfile() {
    const { data } = await api.get('/api/v1/member/profile');
    return data;
  },

  async logout() {
    await api.post('/api/v1/auth/logout');
  },

  async getNotifications({ page = 1, size = 10, hours = 48 } = {}) {
    const { data } = await api.get('/api/v1/users/notifications', {
      params: { page, size, hours },
    });
    return data;
  },

  async getMyBoards({ page = 1, size = 10 } = {}) {
    const { data } = await api.get('/api/v1/boards/my', {
      params: { page, size },
    });
    return data;
  },

  async getMyComments({ page = 1, size = 10 } = {}) {
    const { data } = await api.get('/api/v1/comments/my', {
      params: { page, size },
    });
    return data;
  },

  async updateMarketingAgreement(agreed) {
    if (typeof agreed !== 'boolean') {
      throw new Error('마케팅 정보 수신 동의 여부(Boolean)를 전달해야 합니다.');
    }
    const payload = { agreed };
    const { data } = await api.put(
      '/api/v1/member/marketing-agreement',
      payload,
    );
    return data;
  },

  async updateNickname(nickname) {
    const { data } = await api.put('/api/v1/member/nickname', { nickname });
    return data;
  },

  async withdraw() {
    await api.delete('/api/v1/auth/withdraw');
  },
};
