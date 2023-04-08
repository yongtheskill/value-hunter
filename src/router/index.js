import { createRouter, createWebHistory } from 'vue-router';

import { checkAdmin } from '@/utils/auth';

const adminPages = ['manage', 'manage classes'];

const ensureUnauthed = async () => {
  console.log('ensureUnauthed: ', await checkAuthed());
  if (await checkAuthed()) {
    return '/manage';
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'join',
      component: () => import('../views/JoinView.vue'),
    },
    {
      path: '/login',
      name: 'login',
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
    { path: '/p', name: 'play', component: () => import('../views/PlayView.vue') },
    {
      path: '/p/i',
      name: 'intro',
      component: () => import('../views/IntroView.vue'),
    },
    { path: '/run/:id/s', name: 'start game', component: () => import('../views/StartView.vue') },
    { path: '/run/:id/c', name: 'run game', component: () => import('../views/ControlView.vue') },
  ],
});

const canUserAccess = async (to) => {
  if (adminPages.includes(to.name)) {
    return await checkAdmin();
  }
  return true;
};

router.beforeEach(async (to, from) => {
  const canAccess = await canUserAccess(to);
  if (!canAccess && to.name != 'login') {
    return { name: 'login' };
  }
});

export default router;
