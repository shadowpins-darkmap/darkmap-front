import axios from 'axios';
import { API_BASE_URL } from '@/constant/url';
import pinia from '@/store';
import { useAuthStore } from '@/store/useAuthStore';

const REFRESH_ENDPOINT = '/api/v1/auth/refresh';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let refreshRequest = null;

const getAuthStore = () => useAuthStore(pinia);

const requestTokenRefresh = async () => {
  if (!refreshRequest) {
    refreshRequest = refreshClient.post(REFRESH_ENDPOINT).finally(() => {
      refreshRequest = null;
    });
  }
  return refreshRequest;
};

const forceLogout = async () => {
  try {
    const authStore = getAuthStore();
    await authStore.logout({ skipRequest: true });
  } catch (e) {
    console.error('Failed to cleanup auth state after refresh error:', e);
  } finally {
    window.dispatchEvent(new CustomEvent('auth:refresh-failed'));
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!response || !config) {
      return Promise.reject(error);
    }

    if (response.status !== 401) {
      return Promise.reject(error);
    }

    const isRefreshRequest = config.url?.includes(REFRESH_ENDPOINT);
    if (isRefreshRequest) {
      await forceLogout();
      return Promise.reject(error);
    }

    if (config._retry) {
      return Promise.reject(error);
    }

    try {
      config._retry = true;
      await requestTokenRefresh();
      return api(config);
    } catch (refreshError) {
      await forceLogout();
      return Promise.reject(refreshError);
    }
  },
);

export default api;
