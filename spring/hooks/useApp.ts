import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAppStore } from "../store/app";
import { useAccountStore } from "../store/account";

export function useApp() {
  const route = useRoute();
  const router = useRouter();
  const appStore = useAppStore();
  const accountStore = useAccountStore();
  const routes = router.getRoutes();

  const appInited = computed(() => appStore.inited);

  // 应用信息
  const appInfo = computed(() => appStore.info);

  const appLayout = computed(() => appStore.layout);

  const appBrowser = computed(() => appStore.browser);

  const requestCounter = computed(() => appStore.requestCounter);

  // 当前应用名
  const appName = computed(() => appStore.currentAppName);

  // 应用全部菜单
  const appMenu = computed(() => accountStore.menuRules);

  // 当前应用
  const currentApp = computed(() => getAppByName(appName.value));

  // 菜单模板
  const menuStyle = computed(() => {
    let appRoute = getRouteByName(appName.value);
    return appRoute?.meta?.menuStyle || "element";
  });

  // 获取应用路由
  function getRouteByName(name) {
    return routes.find((route) => route.name == name);
  }

  // 获取应用动态菜单
  function getAppByName(name) {
    return appMenu.value.find((item) => item.name == name);
  }

  function getAppMenuByName(name) {
    let app = appMenu.value.find((app) => app.name == name);
    if (app && app.children) {
      return app.children;
    }
    return [];
  }

  // 当前应用菜单
  const appChildrenMenu = computed(() => {
    if (currentApp.value?.children) {
      return currentApp.value.children;
    } else {
      return [];
    }
  });

  // 切换应用
  const changeApp = (name) => {
    let selectedApp = getAppByName(name);

    //1.如果是页面 则直接打开
    if (selectedApp.type == "page") {
      appStore.changeApp(name);

      router.push({ name });
    }

    //2.如果是菜单 找菜单组件然后弹出
    if (selectedApp.type == "menu") {
      // 反选
      if (appName.value == name) {
        appStore.menuCollapse(true);
        setTimeout(() => {
          appStore.changeApp("");
        }, 150);
      } else {
        appStore.changeApp(name);
        appStore.menuCollapse(false);
      }
    }
  };

  return {
    appInited,
    appInfo, // 应用信息
    appLayout, // 应用布局
    appMenu, // 全部菜单
    appName, // 当前应用名称
    appBrowser, // 当前浏览器
    requestCounter, // 请求数量计数器
    currentApp, // 当前应用
    appChildrenMenu, // 应用子菜单
    changeApp, // 切换应用，
    menuStyle, // 菜单模板
  };
}
