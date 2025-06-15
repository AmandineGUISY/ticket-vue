import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../app/login.vue';
import RegisterView from '../app/register.vue';
import CrmView from '../app/crm.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {

        path: '/crm',
        name: 'Crm',
        component: CrmView,

    },
    {
        path: '/',
        redirect: '/login',
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
