import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		accessToken: null,
		refreshToken: null,
		user: null
	}),
	getters: {
		isLoggedIn: (s) => !!s.accessToken,
	},
	actions: {
		initFromStorage() {
			const at = localStorage.getItem('accessToken');
			const rt = localStorage.getItem('refreshToken');
			if (at) {
				this.accessToken = at;
				this.refreshToken = rt;
				// 선택: 사용자 프로필 호출
				// this.fetchMe().catch(() => this.logout());
			}
		},
		loginWithTokens(at, rt) {
			this.accessToken = at;
			this.refreshToken = rt ?? null;
			localStorage.setItem('accessToken', at);
			if (rt) localStorage.setItem('refreshToken', rt);
			// 선택: 사용자 프로필 바로 불러오기
			// this.fetchMe().catch(() => this.logout());
		},
		logout() {
			this.accessToken = null;
			this.refreshToken = null;
			this.user = null;
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
		},
		// async fetchMe() {
		// 	// 실제 API로 교체하세요
		// 	// 예) GET https://api.kdark.weareshadowpins.com/api/v1/me
		// 	const res = await fetch('/api/me', {
		// 		headers: { Authorization: `Bearer ${this.accessToken}` },
		// 	});
		// 	if (!res.ok) throw new Error('ME_FAILED');
		// 	this.user = await res.json();
		// },
	},
});
