import { RouteRecordRaw } from 'vue-router';

export const rootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Layout',
  redirect: { name: 'dashboard.dashboard' },
  component: () => import('@/spring/layouts/index.vue'),
  meta: {
    title: 'menu.home',
    taskbar: false,
    hideInMenu: true,
  },
  children: [],
};

// 登录
export const loginRoute: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/spring/views/login/index.vue'),
  meta: {
    title: '登录',
    login: false,
    hideInMenu: true,
    hideInTabs: true,
  },
};

// 错误页面
export const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/spring/layouts/index.vue'),
    meta: {
      title: '错误页面',
      hideInMenu: true,
    },
    children: [
      {
        path: '404',
        name: 'NotFoundPage',
        component: () => import('@/spring/views/error/404.vue'),
        meta: {
          title: '未找到页面',
          hideInTabs: true,
          hideInMenu: true,
        },
      },
      {
        path: '401',
        name: 'NotLogin',
        component: () => import('@/spring/views/error/401.vue'),
        meta: {
          title: '请先登录',
          hideInTabs: true,
          hideInMenu: true,
        },
      },
      {
        path: '403',
        name: 'Forbidden',
        component: () => import('@/spring/views/error/403.vue'),
        meta: {
          title: '暂无权限访问',
          hideInTabs: true,
          hideInMenu: true,
        },
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/error/404',
    meta: {
      hideInTabs: true,
      hideInMenu: true,
    },
  },
];
