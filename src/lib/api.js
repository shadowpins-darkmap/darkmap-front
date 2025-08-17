// src/lib/api.js
import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// ✅ 기존 인증 필요 인스턴스
const api = axios.create({
	baseURL: 'https://api.kdark.weareshadowpins.com',
	withCredentials: true,
});

api.interceptors.request.use((config) => {
	const auth = useAuthStore();
	if (auth.accessToken) {
		config.headers.Authorization = `Bearer ${auth.accessToken}`;
	}
	return config;
});

// ✅ 인증 실패시 자동 갱신 + 재시도
let refreshing = false;
let waiters = [];

api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const auth = useAuthStore();
		const original = err.config;

		if (err.response && err.response.status === 401 && !original._retry) {
			if (refreshing) {
				await new Promise((r) => waiters.push(r));
				original.headers.Authorization = `Bearer ${auth.accessToken}`;
				return api(original);
			}

			try {
				refreshing = true;
				original._retry = true;
				const { data } = await axios.post(
					'https://api.kdark.weareshadowpins.com/api/v1/auth/refresh',
					{},
					{ withCredentials: true }
				);

				if (!data?.accessToken) throw new Error('NO_NEW_TOKEN');

				auth.loginWithTokens(data.accessToken);
				waiters.forEach((w) => w());
				waiters = [];
				original.headers.Authorization = `Bearer ${auth.accessToken}`;
				return api(original);
			} catch (e) {
				auth.logout();
				waiters.forEach((w) => w());
				waiters = [];
				throw e;
			} finally {
				refreshing = false;
			}
		}

		throw err;
	}
);

// ✅ 비로그인용 인스턴스 (Authorization 헤더 없음)
export const publicApi = axios.create({
	baseURL: 'https://api.kdark.weareshadowpins.com',
	withCredentials: false, // 쿠키 필요 없음
});

export default api;
