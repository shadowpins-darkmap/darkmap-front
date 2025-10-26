import api from '@/lib/api';

export const boardsApi = {
  async createBoard(formData) {
    const { data } = await api.post('/api/v1/boards', formData);
    return data;
  },

  async createIncidentReport(formData) {
    const { data } = await api.post('/api/v1/incidentReport/reports', formData);
    return data;
  },

  async getBoardById(boardId) {
    const { data } = await api.get(`/api/v1/boards/${boardId}`);
    return data;
  },

  async searchBoardByKeyword(keyword, page = 0) {
    const { data } = await api.get('/api/v1/search/all', {
      params: { keyword, page },
    });
    return data;
  },

  async likeBoard(boardId) {
    const { data } = await api.post(`/api/v1/boards/${boardId}/like`);
    return data;
  },

  async updateBoard(boardId, formData) {
    const { data } = await api.put(`/api/v1/boards/${boardId}`, formData);
    return data;
  },

  async deleteBoard(boardId) {
    const { data } = await api.delete(`/api/v1/boards/${boardId}`);
    return data;
  },

  async getBoards(params = {}) {
    const { data } = await api.get('/api/v1/boards', { params });
    return data;
  },

  async getRecentBoards(pageOptions = {}) {
    const params = {
      page: 1,
      size: 20,
      sortBy: 'createdAt',
      direction: 'DESC',
      ...pageOptions,
    };
    const { data } = await api.get('/api/v1/boards/recent', {
      params,
    });
    return data;
  },

  async getPopularBoards(limit = 10) {
    const { data } = await api.get('/api/v1/boards/popular', {
      params: { limit },
    });
    return data;
  },

  async getBoardCount() {
    const { data } = await api.get('/api/v1/boards/count');
    return data;
  },

  async getLikeStatus(boardId) {
    const { data } = await api.get(`/api/v1/boards/${boardId}/like/status`);
    return data;
  },

  async getRecentPopularByLikes(days = 7, minLikes = 1, pageOptions = {}) {
    const params = {
      days,
      minLikes,
      page: pageOptions.page || 0,
      size: pageOptions.size || 100,
      sortBy: pageOptions.sortBy || 'createdAt',
      direction: pageOptions.direction || 'DESC',
    };
    const { data } = await api.get('/api/v1/boards/recent-popular-by-likes', {
      params,
    });
    return data;
  },

  async getPopularByLikes(minLikes = 1, pageOptions = {}) {
    const params = {
      minLikes,
      page: pageOptions.page || 0,
      size: pageOptions.size || 100,
      sortBy: pageOptions.sortBy || 'likes',
      direction: pageOptions.direction || 'DESC',
    };
    const { data } = await api.get('/api/v1/boards/popular-by-likes', {
      params,
    });
    return data;
  },

  async getMyLikedBoards(pageOptions = {}) {
    const params = {
      page: pageOptions.page || 0,
      size: pageOptions.size || 100,
      sortBy: pageOptions.sortBy || 'createdAt',
      direction: pageOptions.direction || 'DESC',
    };
    const { data } = await api.get('/api/v1/boards/likes/my', { params });
    return data;
  },

  async reportBoard(boardId, reportData, attachmentFile = null) {
    const formData = new FormData();
    const params = {
      reportType: reportData.reportType,
      reason: reportData.reason,
      additionalInfo: reportData.additionalInfo || '',
    };
    if (attachmentFile) {
      formData.append('attachmentFile', attachmentFile);
    }
    const { data } = await api.post(
      `/api/v1/boards/${boardId}/reports`,
      formData,
      { params },
    );
    return data;
  },

  async getBoardReportStatus(boardId) {
    const { data } = await api.get(`/api/v1/boards/${boardId}/reports/check`);
    return data;
  },
};
