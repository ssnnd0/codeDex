import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '@/components/Dashboard.vue';
import Presentation from '@/components/Presentation.vue';
import JoinPage from '@/components/JoinPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/presentation/:code/:slideIndex',
      component: Presentation,
    },
    {
      path: '/join',
      component: JoinPage,
    },
    {
      path: '/dashboard',
      component: Dashboard,
    },
  ],
});

export default router;
