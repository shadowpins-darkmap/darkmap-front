import { createWebHistory, createRouter } from 'vue-router'
import RenderMap from '@/components/RenderMap.vue'
import SocialRedirectKakao from '@/components/socialRedirect/SocialRedirectKakao.vue';
import SocialRedirectGoogle from '@/components/socialRedirect/SocialRedirectGoogle.vue';

const routes = [
	{
		path: '/', // TestComponent.vue로 이동할 Path
		name: 'RenderMap', // router name
		component: RenderMap, // Path로 이동될 Component
	},
	{
		path: '/social-redirect-kakao',
		name: 'SocialRedirectKakao',
		component: SocialRedirectKakao,
	},
	{
		path: '/social-redirect-google',
		name: 'SocialRedirectGoogle',
		component: SocialRedirectGoogle,
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
