import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const api = axios.create({
	baseURL: 'https://api.kdark.weareshadowpins.com',
	withCredentials: true, // 서버 쿠키(refresh_token) 자동 포함
});

// 요청 인터셉터: accessToken이 있으면 Authorization 헤더 추가
api.interceptors.request.use((config) => {
	const auth = useAuthStore();
	if (auth.accessToken) {
		config.headers.Authorization = `Bearer ${auth.accessToken}`;
	}
	return config;
});

// 응답 인터셉터: 401이면 새 토큰 갱신 시도 → 실패시 로그아웃
let refreshing = false;
let waiters = [];

api.interceptors.response.use(
	(res) => res,
	async (err) => {
		const auth = useAuthStore();
		const original = err.config;

		if (err.response && err.response.status === 401 && !original._retry) {
			if (refreshing) {
				// 이미 갱신 중이면 끝날 때까지 대기 후 재시도
				await new Promise((r) => waiters.push(r));
				original.headers.Authorization = `Bearer ${auth.accessToken}`;
				return api(original);
			}

			try {
				refreshing = true;
				original._retry = true;

				// 서버는 refresh 쿠키를 보고 새 access 토큰을 내려줌
				const { data } = await axios.post(
					'https://api.kdark.weareshadowpins.com/api/v1/auth/refresh',
					{},
					{ withCredentials: true }
				);

				if (!data?.accessToken) throw new Error('NO_NEW_TOKEN');

				auth.loginWithTokens(data.accessToken); // pinia&localStorage 반영
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

export default api;
