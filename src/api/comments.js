import api from '@/lib/api';

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

export const likeComment = async (commentId) => {
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

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/api/v1/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
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
