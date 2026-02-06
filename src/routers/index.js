import { createWebHistory, createRouter } from 'vue-router';

// Route-level code splitting for better performance
const routes = [
  {
    path: '/',
    name: 'RenderMap',
    component: () => import('@/components/RenderMap.vue'),
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import('@/views/auth/LoginView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
