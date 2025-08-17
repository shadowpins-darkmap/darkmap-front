import { defineStore } from 'pinia';
import axios from 'axios';

export const useStatsStore = defineStore('stats', {
	state: () => ({
		totalMemberCount: 0,
		totalBoardCount: 0,
		incidentReportCount: 0,
		message: '',
	}),
	actions: {
		async fetchStats() {
			try {
				const { data } = await axios.get(
					'https://api.kdark.weareshadowpins.com/api/v1/main/journal-pannel'
				);
				if (data.success) {
					this.totalMemberCount = data.totalMemberCount;
					this.totalBoardCount = data.totalBoardCount;
					this.incidentReportCount = data.incidentReportCount;
					this.message = data.message;
				}
			} catch (error) {
				console.error('📉 통계 패널 호출 실패:', error);
			}
		},
	},
});
