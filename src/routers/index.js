import { createWebHistory, createRouter } from 'vue-router';

const MainView = () => import('@/views/MainView.vue');

const routes = [
  {
    path: '/',
    name: 'RenderMap',
    component: MainView,
  },
  {
    path: '/login',
    name: 'LoginView',
    component: MainView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
