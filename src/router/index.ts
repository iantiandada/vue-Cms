import { createRouter, createWebHashHistory } from 'vue-router'
import Index from "@/Index.vue";
import Login from "@/Login.vue";
import Aside from "@/Aside.vue";


const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/index', component: Index },
    { path: '/aside', component: Aside }
]

const router = createRouter({
    history: createWebHashHistory(),   // 推荐用 hash 模式，避免后端配置
    routes
})

export default router