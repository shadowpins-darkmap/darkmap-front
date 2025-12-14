import { defineStore } from 'pinia';
import { userApi } from '@/api/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
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
    myCommentsLoaded: false,
    myCommentsLoading: false,
  }),

  getters: {
    isLoggedIn: (s) => s.isAuthenticated,
  },

  actions: {
    requireAuth() {
      return this.isAuthenticated;
    },
    setAuthenticated(userData = null) {
      this.isAuthenticated = true;
      if (userData) {
        this.setUserInfo(userData);
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

    setMyComments(response) {
      this.myComments = response?.data || [];
      this.commentsPage =
        response?.pageInfo?.currentPage ?? (this.myComments.length ? 1 : 0);
      this.commentsTotalPages =
        response?.pageInfo?.totalPages ?? (this.myComments.length ? 1 : 0);
      this.myCommentsLoaded = true;
      this.myCommentsLoading = false;
    },

    clearUserData() {
      this.isAuthenticated = false;
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
      this.myCommentsLoaded = false;
      this.myCommentsLoading = false;
    },

    async restoreSession() {
      try {
        const userData = await userApi.getMe();

        this.setAuthenticated(userData);
        return userData;
      } catch (error) {
        console.error('❌ 세션 복원 실패:', error);
        this.clearUserData();
        return null;
      }
    },

    async logout({ skipRequest = false } = {}) {
      try {
        if (!skipRequest) {
          await userApi.logout();
        }
      } catch (e) {
        console.error('로그아웃 API 실패:', e);
      } finally {
        this.clearUserData();
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

    async fetchMyComments(params = {}, { force = false } = {}) {
      if (!this.requireAuth()) return;
      const skipCache =
        !force &&
        this.myCommentsLoaded &&
        (!params || Object.keys(params).length === 0);
      if (skipCache) return { data: this.myComments };
      this.myCommentsLoading = true;
      try {
        const data = await userApi.getMyComments(params);
        this.setMyComments(data);
        return data;
      } catch (error) {
        this.myCommentsLoading = false;
        throw error;
      }
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
        ]);
        return userData;
      } finally {
        this.loading = false;
      }
    },
  },
});
