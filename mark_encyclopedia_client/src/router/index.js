import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginComponent from '../components/LoginComponent.vue'
import RegistrationComponent from '@/components/RegistrationComponent.vue'
import ArticleView from '@/views/ArticleView.vue';

const routes = [
  {
    path: '/',
    redirect: () => {
      const token = sessionStorage.getItem('token');
      return token ? '/home' : '/login';
    }
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
    path: '/register',
    name: 'register',
    component: RegistrationComponent,
    meta: {
      quest: true
    }
  },
  {
    path: '/articles/:id', 
    name: 'article', 
    component: ArticleView,
    meta: {
      requireAuth: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');

  if (to.name == 'login') {
    sessionStorage.removeItem('token');
  }

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
