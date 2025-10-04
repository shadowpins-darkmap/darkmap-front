import api from '@/lib/api';

// 게시글 작성
export const createBoard = async (formData) => {
  try {
    const response = await api.post('/api/v1/boards', formData);
    return response.data;
  } catch (error) {
    console.error('게시글 작성 실패:', error);
    throw error;
  }
};

export const getArticleById = async (boardId) => {
  try {
    const response = await api.get(`/api/v1/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    throw error;
  }
};

// 게시글 수정
export const updateBoard = async (boardId, formData) => {
  try {
    const response = await api.put(`/api/v1/boards/${boardId}`, formData);
    return response.data;
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    throw error;
  }
};

// 게시글 삭제
export const deleteBoard = async (boardId) => {
  try {
    const response = await api.delete(`/api/v1/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    throw error;
  }
};

// 게시글 목록 조회 (검색 포함)
export const fetchBoards = async (searchOptions = {}, pageOptions = {}) => {
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

// 게시글 상세 조회
export const fetchBoardDetail = async (boardId) => {
  try {
    const response = await api.get(`/api/v1/boards/${boardId}`);
    return response.data;
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
    throw error;
  }
};

// 최근 게시글 조회
export const fetchRecentBoards = async (limit = 10) => {
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

// 인기 게시글 조회
export const fetchPopularBoards = async (limit = 10) => {
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

// 내가 작성한 게시글 조회
export const fetchMyBoards = async (pageOptions = {}) => {
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

// 게시글 카운트 조회
export const fetchBoardCount = async () => {
  try {
    const response = await api.get('/api/v1/boards/count');
    return response.data;
  } catch (error) {
    console.error('게시글 카운트 로딩 실패:', error);
    throw error;
  }
};

// 좋아요 상태 조회
export const fetchLikeStatus = async (boardId) => {
  try {
    const response = await api.get(`/api/v1/boards/${boardId}/like/status`);
    return response.data;
  } catch (error) {
    console.error('좋아요 상태 조회 실패:', error);
    throw error;
  }
};

// 지금 가장 뜨거운 글
export const fetchRecentPopularByLikes = async (
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

// 최소 설정한 좋아요 수 이상의 글
export const fetchPopularByLikes = async (minLikes = 1, pageOptions = {}) => {
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

// 내가 좋아요한 게시글 조회
export const fetchMyLikedBoards = async (pageOptions = {}) => {
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

// 게시글 신고
export const reportBoard = async (
  boardId,
  reportData,
  attachmentFile = null,
) => {
  try {
    const formData = new FormData();

    const params = {
      boardId,
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

// 게시글 신고 여부 확인
export const checkBoardReport = async (boardId) => {
  try {
    const response = await api.get(`/api/v1/boards/${boardId}/reports/check`);
    return response.data;
  } catch (error) {
    console.error('게시글 신고 확인 실패:', error);
    throw error;
  }
};

export const createComment = async (boardId, content) => {
  try {
    const response = await api.post(`/api/v1/comments`, {
      boardId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('댓글 작성 실패:', error);
    return null;
  }
};

export const getCommentsByBoardId = async (boardId, page = 0, size = 10) => {
  try {
    const response = await api.get(`/api/v1/comments/board/${boardId}`, {
      params: {
        page,
        size,
        sortBy: 'createdAt',
        direction: 'DESC',
      },
    });
    return response.data;
  } catch (error) {
    console.error('댓글 조회 실패:', error);
    return null;
  }
};

export const toggleCommentLike = async (commentId) => {
  try {
    const response = await api.post(`/api/v1/comments/${commentId}/like`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('자신의 댓글에 좋아요를 누를 수 없습니다.');
    }
    console.error('댓글 좋아요 실패:', error);
    throw error;
  }
};

export const reportComment = async (commentId, reportData) => {
  try {
    const params = {
      reportType: reportData.reportType,
      reason: reportData.reason,
      additionalInfo: reportData.additionalInfo || '',
    };

    const response = await api.post(
      `/api/v1/comments/${commentId}/reports`,
      null,
      { params },
    );
    return response.data;
  } catch (error) {
    console.error('댓글 신고 실패:', error);
    return null;
  }
};

export const checkCommentReport = async (commentId) => {
  try {
    const response = await api.get(
      `/api/v1/comments/${commentId}/reports/check`,
    );
    return response.data;
  } catch (error) {
    console.error('댓글 신고 확인 실패:', error);
    return null;
  }
};
