import { createWebHistory, createRouter } from 'vue-router';
import RenderMap from '@/components/RenderMap.vue';
import SocialRedirect from '@/components/socialRedirect/SocialRedirect.vue';
import SocialLoginStart from '@/components/socialRedirect/SocialLoginStart.vue';

const routes = [
  {
    path: '/', // TestComponent.vue로 이동할 Path
    name: 'RenderMap', // router name
    component: RenderMap, // Path로 이동될 Component
  },
  {
    path: '/social-redirect-kakao',
    name: 'SocialRedirectKakao',
    component: SocialRedirect,
  },
  {
    path: '/social-redirect-google',
    name: 'SocialRedirectGoogle',
    component: SocialRedirect,
  },
  {
    path: '/social-login-start',
    name: 'SocialLoginStart',
    component: SocialLoginStart,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
