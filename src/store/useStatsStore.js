import { defineStore } from 'pinia';
import { publicApi } from '@/lib/api'; // 비인증용 API 인스턴스 사용

export const useStatsStore = defineStore('stats', {
	state: () => ({
		totalMemberCount: 0,
		totalBoardCount: 0,
		incidentReportCount: 0,
		loaded: false,
	}),

	actions: {
		async fetchStats() {
			try {
				const res = await publicApi.get('/api/v1/main/journal-pannel');
				const data = res.data;

				this.totalMemberCount = data.totalMemberCount;
				this.totalBoardCount = data.totalBoardCount;
				this.incidentReportCount = data.incidentReportCount;
				this.loaded = true;
			} catch (err) {
				console.error('[StatsStore] 통계 정보 불러오기 실패:', err);
			}
		},
	},
});
