import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		accessToken: null,
		user: null
	}),
	getters: {
		isLoggedIn: (s) => !!s.accessToken,
	},
	actions: {
		initFromStorage() {
			const at = localStorage.getItem('accessToken');
			if (at) {
				this.accessToken = at;
				// 선택: 사용자 프로필 호출
				// this.fetchMe().catch(() => this.logout());
			}
		},
		loginWithTokens(at) {
			this.accessToken = at;
			localStorage.setItem('accessToken', at);
			// 선택: 사용자 프로필 바로 불러오기
			// this.fetchMe().catch(() => this.logout());
		},
		async logout() {
			//TODO : api 
			await fetch('https://api.kdark.weareshadowpins.com/api/v1/auth/logout', {
				method: 'POST',
				credentials: 'include', // 쿠키 포함
			});

			this.accessToken = null;
			this.user = null;
			localStorage.removeItem('accessToken');
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
