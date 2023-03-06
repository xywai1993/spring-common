import { isEmpty, isArray } from 'lodash';
import { useAccountStore } from '@/spring/store/account';

// 页面路由
const appRoutes = [];
// const appRouteFiles = import.meta.glob('../../modules/*/routes/index.js', { eager: true });
// for (const path in appRouteFiles) {
//   // 封装路由表
//   if (!isEmpty(appRouteFiles[path].default)) {
//     let route = appRouteFiles[path].default;
//     if (isArray(route)) {
//       appRoutes.push(...route);
//     } else {
//       appRoutes.push(route);
//     }
//   }
// }

// 扁平化菜单
function flattenMenu(menuRoutes) {
  let menu = [];
  menuRoutes.forEach((item) => {
    menu.push({
      id: item.id,
      name: item.name,
      title: item.title,
      icon: item.icon,
      type: item.type,
      parent_id: item.parent_id,
      status: item.status,
      weigh: item.weigh,
    });
    if (item.children) {
      menu.push(...flattenMenu(item.children));
    }
  });

  return menu;
}

// 添加路由
function addRoute(routes, menus) {
  routes.forEach((item) => {
    const menu = menus.find((menu) => menu.name === item.name);
    if (menu) {
      item.meta = {
        ...item.meta,
        title: menu.title,
        icon: menu.icon,
      };
    }
    if (item.children) {
      addRoute(item.children, menus);
    }
  });
}

// 注册动态路由(根据后端返回的菜单动态注册)
export function registerDynamicRoutes(router) {
  const accountStore = useAccountStore();
  const menuRoutes = flattenMenu(accountStore.menus);
  addRoute(appRoutes, menuRoutes);
  appRoutes.forEach((route) => {
    router.addRoute(route);
  });
}
