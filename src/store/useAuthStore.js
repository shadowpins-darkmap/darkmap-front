import { defineStore } from 'pinia';
import { userApi } from '@/api/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null,
    loading: false,

    email: null,
    nickname: null,
    id: null,
    level: null,
    loginCount: null,
    joinedAt: null,

    profile: null,
    message: null,

    notifications: [],
    notificationsPage: 0,
    notificationsTotalPages: 0,

    myBoards: [],
    boardsPage: 0,
    boardsTotalPages: 0,
    boardsTotalElements: 0,

    myComments: [],
    commentsPage: 0,
    commentsTotalPages: 0,
  }),

  getters: {
    isLoggedIn: (s) => !!s.accessToken,
  },

  actions: {
    setAccessToken(token) {
      this.accessToken = token;
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    },

    setUserInfo(userData) {
      this.email = userData.email;
      this.nickname = userData.nickname;
      this.id = userData.id;
      this.level = userData.level;
      this.loginCount = userData.loginCount;
      this.joinedAt = userData.joinedAt;
    },

    setProfile(profileData) {
      this.profile = profileData.data;
      this.message = profileData.message;
    },

    setNotifications(data) {
      this.notifications = data.content;
      this.notificationsPage = data.pageable.pageNumber;
      this.notificationsTotalPages = data.totalPages;
    },

    setMyBoards(response) {
      this.myBoards = response.data;
      this.boardsPage = response.data?.pageInfo?.currentPage || 0;
      this.boardsTotalPages = response.data?.pageInfo?.totalPages || 0;
      this.boardsTotalElements = response.data?.pageInfo?.totalElements || 0;
    },

    setMyComments(data) {
      this.myComments = data.content;
      this.commentsPage = data.pageable.pageNumber;
      this.commentsTotalPages = data.totalPages;
    },

    // 상태 초기화
    clearUserData() {
      this.accessToken = null;
      this.email = null;
      this.nickname = null;
      this.id = null;
      this.level = null;
      this.loginCount = null;
      this.joinedAt = null;
      this.profile = null;
      this.message = null;
      this.notifications = [];
      this.myBoards = [];
      this.myComments = [];
    },

    async initFromStorage() {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      this.accessToken = token;
      try {
        await this.fetchAllUserData();
      } catch (e) {
        console.error('토큰 복원 실패:', e);
        // await this.logout();
      }
    },

    loginWithTokens(accessToken) {
      this.setAccessToken(accessToken);
    },

    async logout() {
      try {
        await userApi.logout();
      } catch (e) {
        console.error('로그아웃 API 실패:', e);
      }
      this.clearUserData();
    },

    async fetchUserProfile() {
      const data = await userApi.getMe();
      this.setUserInfo(data);
      return data;
    },

    async fetchProfile() {
      const data = await userApi.getProfile();
      this.setProfile(data);
      return data;
    },

    async fetchNotifications(params) {
      const data = await userApi.getNotifications(params);
      this.setNotifications(data);
    },

    async fetchMyBoards(params) {
      const data = await userApi.getMyBoards(params);
      this.setMyBoards(data);
    },

    async fetchMyComments(params) {
      const data = await userApi.getMyComments(params);
      this.setMyComments(data);
    },

    async fetchAllUserData() {
      this.loading = true;
      try {
        const [userData] = await Promise.all([
          this.fetchUserProfile(),
          this.fetchProfile(),
          this.fetchNotifications(),
          this.fetchMyBoards(),
          this.fetchMyComments(),
        ]);
        return userData;
      } finally {
        this.loading = false;
      }
    },
  },
});