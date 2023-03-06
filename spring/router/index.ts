// 路由
import { rootRoute, errorRoutes, loginRoute } from './basic';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { setupRouterGuard } from './guard';

import { routeList } from '@/router';

export const routes: RouteRecordRaw[] = [rootRoute, ...routeList, loginRoute, ...errorRoutes];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export function setupRouter(app) {
  // registerDynamicRoutes(router);
  app.use(router);
  setupRouterGuard(router);
  return router;
}

export default router;
