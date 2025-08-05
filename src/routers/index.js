import { createWebHistory, createRouter } from 'vue-router'
import RenderMap from '@/components/RenderMap.vue'
import SocialRedirect from '@/components/socialRedirect/SocialRedirect.vue';

const routes = [
	{
		path: '/', // TestComponent.vue로 이동할 Path
		name: 'RenderMap', // router name
		component: RenderMap, // Path로 이동될 Component
	},
	{
		path: '/social-redirect', // 리다이렉트 전용 경로
		name: 'SocialRedirect',
		component: SocialRedirect,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
