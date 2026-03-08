import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/stores/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/topic/TopicList.vue'),
        meta: { title: '首页' },
      },
      {
        path: 'topic/:id',
        name: 'TopicDetail',
        component: () => import('@/views/topic/TopicDetail.vue'),
        meta: { title: '话题详情' },
      },
      {
        path: 'topic/create',
        name: 'TopicCreate',
        component: () => import('@/views/topic/TopicCreate.vue'),
        meta: { title: '发布话题', requiresAuth: true },
      },
      {
        path: 'resources',
        name: 'Resources',
        component: () => import('@/views/resource/ResourceList.vue'),
        meta: { title: '资源分享' },
      },
      {
        path: 'resource/:id',
        name: 'ResourceDetail',
        component: () => import('@/views/resource/ResourceDetail.vue'),
        meta: { title: '资源详情' },
      },
      {
        path: 'resource/create',
        name: 'ResourceCreate',
        component: () => import('@/views/resource/ResourceCreate.vue'),
        meta: { title: '分享资源', requiresAuth: true },
      },
      {
        path: 'user/:id',
        name: 'UserProfile',
        component: () => import('@/views/user/UserProfile.vue'),
        meta: { title: '用户主页' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/user/UserSettings.vue'),
        meta: { title: '个人设置', requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { title: '注册' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, _from, next) => {
  // Update document title
  document.title = to.meta.title ? `${to.meta.title} - 话题圈` : '话题圈';

  // Check auth
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    if (!userStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
  }

  next();
});

export default router;
