import { createRouter, createWebHistory } from 'vue-router'
import { userStore } from '@/stores/userStore.ts'

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

router.beforeEach(async (to, from) => {
  if (!userStore.state.isAuthenticated) {
    const success = await userStore.fetchMe()
    if (!success && to.name !== 'login') {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  } else if (to.name === 'login') {
    return '/home'
  }
  return
})
export default router
