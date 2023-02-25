import { createRouter, createWebHistory } from 'vue-router';

import { user } from '../utils/auth';

const adminPages = ['manage', 'manage classes'];

const checkAuthed = () => {
  if (user) return true;
  return false;
};

const ensureUnauthed = () => {
  if (checkAuthed()) {
    return '/manage';
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'join',
      beforeEnter: [ensureUnauthed],
      component: () => import('../views/JoinView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: [ensureUnauthed],
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('../views/ManageView.vue'),
      children: [
        { path: '', component: () => import('../views/ClassesView.vue'), name: 'manage classes' },
        {
          path: 'users',
          component: () => import('../views/UsersView.vue'),
          name: 'manage users',
        },
        {
          path: 'settings',
          component: () => import('../views/SettingsView.vue'),
          name: 'settings',
        },
      ],
    },
    {
      path: '/run/:id/s',
      name: 'starting game',
      component: () => import('../views/StartView.vue'),
    },
  ],
});

const canUserAccess = async (to) => {
  if (adminPages.includes(to.name)) {
    if (user) return true;
    return false;
  }
  return true;
};

router.beforeEach(async (to, from) => {
  const canAccess = await canUserAccess(to);
  if (!canAccess) return '/login';
});

export default router;
