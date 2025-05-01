import { createWebHistory, createRouter } from 'vue-router'
import RenderMap from '@/components/RenderMap.vue'

const routes = [
  {
    path: '/', // TestComponent.vue로 이동할 Path
    name: 'RenderMap', // router name
    component: RenderMap, // Path로 이동될 Component
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
