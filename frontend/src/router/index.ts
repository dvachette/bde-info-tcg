import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/stores/userStore.ts';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (!userStore.state.isAuthenticated) {
    const success = await userStore.fetchMe();
    if (!success && to.path !== '/login') {
      return '/login';
    }
    return next();
  }
});
export default router
