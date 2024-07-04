import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/views/home.vue";
// 路由信息
let routes = [
    {
        path: "/",
        component: Home,
    },
    {
        path: "/test",
        component: () => import("@/views/test.vue"),
    },
];

// 路由器
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
