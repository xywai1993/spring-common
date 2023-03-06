// import { constantRouterComponents } from '@/router/asyncModules';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import router from './index';

type MenusType = {
  id?: number;
  name: string;
  icon: string;
  title: string;
  access_type: 'Page' | 'Menu' | 'Button';
  meta: {
    title: string;
    icon: string;
  };
  component: any;
  parent: number | string;
  children?: MenusType[];
  redirect?: any;
  path: string;
  scope?: string;
  weigh?: number;
  created_at?: string;
  updated_at?: string;
};

const constantRouterComponents = {};
export function useArray2Menus(arr: MenusType[]) {
  const mapFn = (item: MenusType, parentItem: MenusType | null = null) => {
    item.meta = {
      title: item.title,
      icon: item.icon,
    };
    // if (item.access_type === 'dir') {
    // item.compontent = Layout;
    // item.path = item.path.startsWith('/') ? item.path : `/${item.path}`;
    // }

    if (item.access_type === 'Menu') {
      // const fullPath = parentItem ? `${parentItem.path ?? ''}/${item.path}` : item.path;
      // item.meta.fullPath = fullPath.startsWith('/') ? fullPath : `/${fullPath}`;
      // item.component = constantRouterComponents[item.meta.fullPath];
    }

    return item;
  };

  // 扁平数据转树形结构
  return arr
    .filter((item) => {
      item.children = arr
        .filter((e) => {
          return String(item.name) === String(e.parent);
        })
        .map((cItem) => mapFn(cItem, item));
      return String(item.parent) === '';
    })
    .map((item) => mapFn(item, null));
}

export const createRoutesAndMenus = (arr) => {
  const menuRouter = arr.filter((item) => item.access_type === 'Menu');
  const list = router.getRoutes();
  const layout = list.find((item) => item.name == 'Layout')!;
  const _menu: RouteRecordRaw[] = [];
  menuRouter.forEach((menu) => {
    const r = list.find((item) => item.name === menu.name);

    if (r && !r.children.length) {
      console.log(menu.name.replaceAll('.', '/'));
      const data = {
        components: r.components,
        path: menu.name.replaceAll('.', '/'),
        children: [],
        name: menu.name,
        meta: {
          title: menu.title,
          icon: menu.icon,
        },
      };

      _menu.push(data);
    }
  });

  layout.children = _menu;
  router.addRoute(layout);

  const menus = useArray2Menus(arr.filter((item) => item.access_type === 'Menu'));

  // menus.forEach((item) => _router.addRoute(item));
  // const _menu = _router.getRoutes().filter((item) => !item.children.length);
  // const layout = list.find((item) => item.name == 'Layout')!;
  // layout.children = [..._menu];
  // router.addRoute(layout);

  return {
    menus,
  };
};
