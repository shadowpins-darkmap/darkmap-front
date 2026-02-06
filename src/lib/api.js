import axios from 'axios';
import { API_BASE_URL } from '@/constant/url';
import pinia from '@/store';
import { useAuthStore } from '@/store/useAuthStore';

const REFRESH_ENDPOINT = '/api/v1/auth/refresh';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let refreshRequest = null;

const getAuthStore = () => useAuthStore(pinia);

const requestTokenRefresh = async () => {
  if (refreshRequest) {
    return refreshRequest;
  }

  const authStore = getAuthStore();
  const { refreshToken } = authStore;

  if (!refreshToken) {
    return Promise.reject(new Error('리프레시 토큰이 존재하지 않습니다.'));
  }

  refreshRequest = refreshClient
    .post(REFRESH_ENDPOINT, { refreshToken })
    .then(({ data }) => {
      authStore.setTokens?.(data);
      return data;
    })
    .finally(() => {
      refreshRequest = null;
    });

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

api.interceptors.request.use(
  (config) => {
    const authStore = getAuthStore();
    const token = authStore?.accessToken;

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

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
      const authStore = getAuthStore();
      if (!authStore.refreshToken) {
        await forceLogout();
        return Promise.reject(error);
      }

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
