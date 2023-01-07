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
        component: () => import('@/views/login/user/DashboardView.vue'),
    },
    {
        path: "/account-setting",
        name: "AccountSetting",
        component: () => import('@/views/login/AccountSetting.vue'),
    },
    {
        path: "/profile",
        name: "Profile",
        component: () => import('@/views/login/user/ProfileView.vue'),
    },
    {
        path: "/vacancy",
        name: "Vacancy",
        component: () => import('@/views/login/user/VacancyView.vue'),
    },
    {
        path: "/status",
        name: "Status",
        component: () => import('@/views/login/user/StatusView.vue'),
    },
    {
        path: "/application",
        name: "Application",
        component: () => import('@/views/login/admin/ApplicationView.vue'),
    },
    {
        path: "/account/:level",
        name: "Account",
        component: () => import('@/views/login/admin/AccountView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;