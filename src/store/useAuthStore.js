import { defineStore } from 'pinia';
import api from '@/lib/api';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		accessToken: null,
		loading: false,

		// me 응답에서 가져올 항목
		email: null,
		nickname: null,
		id: null,
		level: null,
		loginCount: null,
		joinedAt: null,

		// profile 응답에서 가져올 항목
		profile: null,
		message: null,
	}),
	getters: {
		isLoggedIn: (s) => !!s.accessToken,
	},
	actions: {
		// 앱 시작 시 로컬 토큰으로 복원
		async initFromStorage() {
			const at = localStorage.getItem('accessToken');
			if (!at) return;
			this.accessToken = at;
			try {
				await this.fetchAll(); // me + profile
			} catch (e) {
				this.logout();
			}
		},

		// 팝업에서 받은 토큰을 저장(쿠키 refresh는 서버가 보유)
		loginWithTokens(at) {
			this.accessToken = at;
			localStorage.setItem('accessToken', at);
		},

		async logout() {

			// 서버에 세션 종료 알림 (쿠키 기반)
			await api.post('/api/v1/auth/logout');

			this.accessToken = null;
			this.me = null;
			this.profile = null;
			localStorage.removeItem('accessToken');
		},

		// 개별 호출
		async fetchMe() {
			const { data } = await api.get('/api/v1/member/me');
			// this.me = data;
			// 상세 필드 저장
			this.email = data.email;
			this.nickname = data.nickname;
			this.id = data.id;
			this.level = data.level;
			this.loginCount = data.loginCount;
			this.joinedAt = data.joinedAt;

			return data;
		},
		async fetchProfile() {
			const { data } = await api.get('/api/v1/member/profile');
			this.profile = data.data;
			// 상세 필드 저장
			this.message = data.message;
			return data;
		},

		// 둘 다 한 번에
		async fetchAll() {
			this.loading = true;
			try {
				const [me] = await Promise.all([this.fetchMe(), this.fetchProfile()]);
				return me;
			} finally {
				this.loading = false;
			}
		},
	},
});
