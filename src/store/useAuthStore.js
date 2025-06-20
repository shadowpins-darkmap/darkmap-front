import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		isLoggedIn: false,
		user: null,
	}),
	actions: {
		login(userData) {
			this.isLoggedIn = true;
			this.user = userData;
			// 토큰 만료일 계산 로직 TODO
		},
		logout() {
			this.isLoggedIn = false;
			this.user = null;
		},
	},
	persist: true,
});
