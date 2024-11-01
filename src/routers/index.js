import { createWebHistory, createRouter } from "vue-router";
import TestMap from "@/components/TestMap.vue";

const routes = [
    {
        path: "/test",  // TestComponent.vue로 이동할 Path
        name: "TestMap",  // router name
        component: TestMap,  // Path로 이동될 Component
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;