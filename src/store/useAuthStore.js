import { defineStore } from 'pinia';
import { userApi } from '@/api/user';
import { ACCESS_TOKEN_NAME } from '@/constant/user';

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
    requireAuth() {
      if (!this.accessToken) {
        return false;
      }
      return true;
    },
    setAccessToken(token) {
      this.accessToken = token;
      if (token) {
        localStorage.setItem(ACCESS_TOKEN_NAME, token);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_NAME);
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

    setNotifications(notificationsData) {
      this.notifications = notificationsData.data;
      this.notificationsPage = notificationsData.currentPage || 1;
      this.notificationsTotalPages =
        Math.ceil(
          notificationsData.totalElements / notificationsData.pageSize,
        ) || 0;
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

    clearUserData() {
      this.setAccessToken(null);
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
      const token = localStorage.getItem(ACCESS_TOKEN_NAME);
      if (!token) return;

      this.accessToken = token;
    },

    loginWithTokens(accessToken, userData = null) {
      this.setAccessToken(accessToken);
      if (userData) {
        this.setUserInfo(userData);
      }
    },

    async logout() {
      this.clearUserData();
      try {
        await userApi.logout();
      } catch (e) {
        console.error('로그아웃 API 실패:', e);
      }
    },

    async fetchUserProfile() {
      if (!this.requireAuth()) return;
      const data = await userApi.getMe();
      this.setUserInfo(data);
      return data;
    },

    async fetchProfile() {
      if (!this.requireAuth()) return;
      const data = await userApi.getProfile();
      this.setProfile(data);
      return data;
    },

    async fetchNotifications(params) {
      if (!this.requireAuth()) return;
      const data = await userApi.getNotifications(params);
      this.setNotifications(data);
      return data;
    },

    async getMyBoards(params) {
      if (!this.requireAuth()) return;
      const data = await userApi.getMyBoards(params);
      this.setMyBoards(data);
      return data;
    },

    async fetchMyComments(params) {
      if (!this.requireAuth()) return;
      const data = await userApi.getMyComments(params);
      this.setMyComments(data);
      return data;
    },

    async fetchAllUserData() {
      if (!this.requireAuth()) return;

      this.loading = true;
      try {
        const [userData] = await Promise.all([
          this.fetchUserProfile(),
          this.fetchProfile(),
          this.fetchNotifications(),
          this.getMyBoards(),
          this.fetchMyComments(),
        ]);
        return userData;
      } finally {
        this.loading = false;
      }
    },
  },
});
