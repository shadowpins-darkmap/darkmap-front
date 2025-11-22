import { API_BASE_URL } from '@/constant/url';
import axios from 'axios';
// import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// const REFRESH_URL = 'https://api.kdark.weareshadowpins.com/api/v1/auth/refresh';

// let refreshing = false;
// let waiters = [];

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const auth = useAuthStore();
//     const original = err.config || {};
//     const status = err.response?.status;

//     if (!status) throw err;

//     const isRefreshCall = original?.url
//       ? original.url.includes('/auth/refresh')
//       : false;

//     if (status === 401 && !isRefreshCall && !original._retry) {
//       if (refreshing) {
//         return new Promise((resolve, reject) => {
//           waiters.push({ resolve, reject, original });
//         });
//       }

//       refreshing = true;
//       original._retry = true;

//       try {
//         await axios.post(REFRESH_URL, {}, { withCredentials: true });

//         auth.setAuthenticated();

//         waiters.forEach(({ resolve, original: waiterOriginal }) => {
//           waiterOriginal._retry = true;
//           resolve(api(waiterOriginal));
//         });
//         waiters = [];

//         return api(original);
//       } catch (e) {
//         waiters.forEach(({ reject }) => reject(e));
//         waiters = [];

//         throw e;
//       } finally {
//         refreshing = false;
//       }
//     }

//     if (status === 403) {
//       throw err;
//     }

//     if (status === 302) {
//       throw err;
//     }

//     throw err;
//   },
// );

export default api;
