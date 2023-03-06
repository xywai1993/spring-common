import { addTaskbar } from '@/spring/hooks/useTaskbar';
import { useAccountStore } from '@/spring/store/account';
import { useAppStore } from '@/spring/store/app';

export function setupRouterGuard(router) {
  router.beforeEach(async (to, from) => {
    let nextPath = '';

    const appStore = useAppStore();

    const useAccount = useAccountStore();
    const isLogin = useAccount.isLogin;
    const taskbar = appStore.taskbar;

    if (isLogin) {
      try {
        await appStore.appLoad();
        if (!useAccount.menus.length) {
          useAccount
            .afterLogin()
            .then()
            .catch((e) => {});
        }
        return true;
      } catch (e) {
        return { name: 'Login', replace: true };
      }
    } else {
      if (to.name !== 'Login') {
        return { name: 'Login', query: { redirect: to.fullPath }, replace: true };
      }
    }
    return true;
  });

  router.afterEach(async (to, from) => {
    // 设置标题
    const appStore = useAppStore();
    document.title = `<${to.meta.title}> ${appStore.info.site_name}`;
    // 添加任务栏历史
    if (!to.meta.hideInTabs) {
      addTaskbar({
        title: to.meta.title,
        name: to.name,
        path: to.path,
        query: to.query,
        icon: to.meta.icon,
        meta: to.meta,
      });
    }
  });
}
