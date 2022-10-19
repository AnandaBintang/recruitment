import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import('@/views/home/HomeView.vue'),
    },
    {
        path: "/login",
        name: "Login",
        component: () => import('@/views/home/LoginView.vue'),
    },
    {
        path: "/signup",
        name: "Signup",
        component: () => import('@/views/home/SignupView.vue'),
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: () => import('@/views/login/DashboardView.vue'),
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import('@/views/login/ProfileView.vue'),
    },
    {
        path: "/vacancy",
        name: "Vacancy",
        component: () => import('@/views/login/VacancyView.vue'),
    },
    {
        path: "/status",
        name: "Status",
        component: () => import('@/views/login/StatusView.vue'),
    },
    {
        path: "/adminboard",
        name: "Adminboard",
        component: () => import('@/views/login/AdminboardView.vue'),
    },
    {
        path: "/application",
        name: "Application",
        component: () => import('@/views/login/ApplicationView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;