// 路由
import { rootRoute, errorRoutes, loginRoute } from "./basic";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { setupRouterGuard } from "./guard";
import { setting } from "../config";

// import { routeList } from "@/router";

export const routes: RouteRecordRaw[] = [
  rootRoute,
  // ...routeList,
  loginRoute,
  ...errorRoutes,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export function setupRouter(app, list: RouteRecordRaw[] = []) {
  // registerDynamicRoutes(router);

  list.forEach((item) => {
    router.addRoute(item);
  });

  app.use(router);
  setupRouterGuard(router);
  return router;
}

export default router;
