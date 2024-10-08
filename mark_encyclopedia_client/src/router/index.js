import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginComponent from '@/components/LoginComponent.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginComponent,
    meta: {
      quest: true
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token == null) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      });
    }
    else next();
  }
  else if (to.matched.some(record => record.meta.guest)) {
    if (token != null) {
      next({ path: '/home' });
    } else {
      next();
    }
  }
  else next();
});

export default router
