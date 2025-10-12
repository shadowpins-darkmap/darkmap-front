import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: 'https://api.kdark.weareshadowpins.com',
  withCredentials: true,
});

const REFRESH_URL = 'https://api.kdark.weareshadowpins.com/api/v1/auth/refresh';

let refreshing = false;
let waiters = [];
let waiterRejects = [];

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const auth = useAuthStore();
    const original = err.config || {};
    const status = err.response?.status;

    if (!status) throw err;

    const isRefreshCall = original?.url
      ? original.url.includes('/auth/refresh')
      : false;

    if (status === 401 && !isRefreshCall && !original._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          waiters.push((newToken) => {
            original.headers = original.headers || {};
            if (newToken) {
              original.headers.Authorization = `Bearer ${newToken}`;
              original._retry = true;
              resolve(api(original));
            } else {
              reject(err);
            }
          });
          waiterRejects.push(reject);
        });
      }

      refreshing = true;
      original._retry = true;

      try {
        const { data } = await axios.post(
          REFRESH_URL,
          {},
          { withCredentials: true },
        );

        if (!data?.accessToken) throw new Error('NO_NEW_TOKEN');

        auth.loginWithTokens(data.accessToken);

        waiters.forEach((resolve) => resolve(data.accessToken));
        waiters = [];
        waiterRejects = [];

        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        waiters.forEach((resolve) => resolve(''));
        waiterRejects.forEach((reject) => reject(e));
        waiters = [];
        waiterRejects = [];

        auth.logout();

        throw e;
      } finally {
        refreshing = false;
      }
    }

    if (status === 403) {
      throw err;
    }

    if (status === 302) {
      throw err;
    }

    throw err;
  },
);

export default api;
