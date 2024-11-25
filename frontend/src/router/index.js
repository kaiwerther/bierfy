// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

// Import components
import Login from '../components/AuthLogin.vue';
import Register from '../components/AuthRegister.vue';
import GoogleCallback from '../components/AuthGoogleCallback.vue';
import Home from '../components/MainPage.vue';
import Profile from '../components/UserProfile.vue';
import TastingsViewList from '../components/TastingsViewList.vue';
import TastingsViewMap from '../components/TastingsViewMap.vue';
import TastingAdd from '../components/TastingAdd.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/auth/google/callback', component: GoogleCallback },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  {
    path: '/tastings/list',
    component: TastingsViewList,
    meta: { requiresAuth: true },
  },
  {
    path: '/tastings/map',
    component: TastingsViewMap,
    meta: { requiresAuth: true },
  },
  {
    path: '/tastings/add',
    component: TastingAdd,
    meta: { requiresAuth: true },
  },
  // Add other routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard for Protected Routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
