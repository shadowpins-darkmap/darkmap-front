import api from '@/lib/api';

export const createBoard = async (formData) => {
  try {
    const response = await api.post('/api/v1/boards', formData);
    return response.data;
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    throw error;
  }
};

export const getBoardById = async (boardId) => {
  try {
    const response = await api.get(`/api/v1/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    throw error;
  }
};

export const likeBoard = async (boardId) => {
  try {
    const response = await api.post(`/api/v1/boards/${boardId}/like`);
    return response.data;
  } catch (error) {
    console.error('게시글 좋아요 실패:', error);
    throw error;
  }
};

export const updateBoard = async (boardId, formData) => {
  try {
    const response = await api.put(`/api/v1/boards/${boardId}`, formData);
    return response.data;
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    const response = await api.delete(`/api/v1/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

export const getBoards = async (searchOptions = {}, pageOptions = {}) => {
  try {
    const params = {
      keyword: searchOptions.keyword || '',
      searchType: searchOptions.searchType || 'TITLE',
      category: searchOptions.category || 'FREE',
      page: pageOptions.page || 0,
      size: pageOptions.size || 10,
      sort: `${pageOptions.sortBy || 'createdAt'},${pageOptions.direction || 'desc'}`,
    };

    const response = await api.get('/api/v1/boards', { params });
    return response.data;
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
    throw error;
  }
};

export const getRecentBoards = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/boards/recent', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('최근 게시글 조회 실패:', error);
    throw error;
  }
};

export const getPopularBoards = async (limit = 10) => {
  try {
    const response = await api.get('/api/v1/boards/popular', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error('인기 게시글 조회 실패:', error);
    throw error;
  }
};

export const getMyBoards = async (pageOptions = {}) => {
  try {
    const params = {
      page: pageOptions.page || 0,
      size: pageOptions.size || 100,
      sortBy: pageOptions.sortBy || 'createdAt',
      direction: pageOptions.direction || 'DESC',
    };

    const response = await api.get('/api/v1/boards/my', { params });
    return response.data;
  } catch (error) {
    console.error('내 게시글 조회 실패:', error);
    throw error;
  }
};

export const getBoardCount = async () => {
  try {
    const response = await api.get('/api/v1/boards/count');
    return response.data;
  } catch (error) {
    console.error('게시글 카운트 로딩 실패:', error);
    throw error;
  }
};

export const getLikeStatus = async (boardId) => {
  try {
    const response = await api.get(`/api/v1/boards/${boardId}/like/status`);
    return response.data;
  } catch (error) {
    console.error('좋아요 상태 조회 실패:', error);
    throw error;
  }
};

export const getRecentPopularByLikes = async (
  days = 7,
  minLikes = 1,
  pageOptions = {},
) => {
  try {
    const params = {
      days,
      minLikes,
      page: pageOptions.page || 0,
      size: pageOptions.size || 100,
      sortBy: pageOptions.sortBy || 'createdAt',
      direction: pageOptions.direction || 'DESC',
    };

    const response = await api.get('/api/v1/boards/recent-popular-by-likes', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('인기 게시글 조회 실패:', error);
    throw error;
  }
};

export const getPopularByLikes = async (minLikes = 1, pageOptions = {}) => {
  try {
    const params = {
      minLikes,
      page: pageOptions.page || 0,
      size: pageOptions.size || 100,
      sortBy: pageOptions.sortBy || 'likes',
      direction: pageOptions.direction || 'DESC',
    };

    const response = await api.get('/api/v1/boards/popular-by-likes', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('좋아요수 기준 인기 게시글 조회 실패:', error);
    throw error;
  }
};

export const getMyLikedBoards = async (pageOptions = {}) => {
  try {
    const params = {
      page: pageOptions.page || 0,
      size: pageOptions.size || 100,
      sortBy: pageOptions.sortBy || 'createdAt',
      direction: pageOptions.direction || 'DESC',
    };

    const response = await api.get('/api/v1/boards/likes/my', { params });
    return response.data;
  } catch (error) {
    console.error('내가 좋아요한 게시글 조회 실패:', error);
    throw error;
  }
};

export const reportBoard = async (
  boardId,
  reportData,
  attachmentFile = null,
) => {
  try {
    const formData = new FormData();

    const params = {
      reportType: reportData.reportType,
      reason: reportData.reason,
      additionalInfo: reportData.additionalInfo || '',
    };

    if (attachmentFile) {
      formData.append('attachmentFile', attachmentFile);
    }

    const response = await api.post(
      `/api/v1/boards/${boardId}/reports`,
      formData,
      { params },
    );
    return response.data;
  } catch (error) {
    console.error('게시글 신고 실패:', error);
    throw error;
  }
};

export const getBoardReportStatus = async (boardId) => {
  try {
    const response = await api.get(`/api/v1/boards/${boardId}/reports/check`);
    return response.data;
  } catch (error) {
    console.error('게시글 신고 확인 실패:', error);
    throw error;
  }
};
