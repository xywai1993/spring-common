/**
 * @description 用户信息、登录、退出登录
 */
import $storage from '@/spring/utils/storage';
import { currentUser, getServerMenu, login } from '../api/index';
import { createRoutesAndMenus } from '@/spring/router/generator-router';
import { menusSetting } from '../config';

import { defineStore } from 'pinia';
import js_md5 from 'js-md5';
import router from '../router';

type AccountStoreType = {
  isLogin: boolean;
  info: {
    username: string;
    avatar: string;
  };
  menus: any[];
  d_menus: any[];
  pageRules: any[];
  apiRules: any[];
};

export const useAccountStore = defineStore({
  id: 'account',
  state: () =>
    ({
      isLogin: !!$storage.get('token'),
      info: {
        username: '',
        avatar: '',
      },
      menus: [], // 菜单权限
      d_menus: [], // 动态路由
      pageRules: [], // 页面权限
      apiRules: [], // 请求权限
    } as AccountStoreType),
  actions: {
    /**
     * @description 登录
     * @param {*} formData
     */
    async login(formData) {
      if (formData.password) {
        formData.password = js_md5(formData.password);
      }
      return login(formData);
    },

    async afterLogin() {
      await this.getInfo();
      if (menusSetting.serverMenus) {
        //todo: 拉取服务端菜单 const serverData = await(serverApi);
        const { data } = await getServerMenu();
        const { menus } = createRoutesAndMenus(data.list);
        this.menus = menus;
      } else {
        this.menus = router
          .getRoutes()
          .filter((item) => (menusSetting.subMenu ? item.children.length : !item.children.length))
          .filter((item) => !item.meta.hideInMenu);
      }

      return Promise.resolve();
    },
    /**
     * @description 设置token
     * @param {*} token
     */
    setToken(token = '') {
      this.token = token;
      if (token === '') {
        this.isLogin = false;
        $storage.remove('token');
      } else {
        this.isLogin = true;
        $storage.set('token', token);
      }
    },

    /**
     * @description 获取用户信息
     */
    async getInfo() {
      const { code, data } = await currentUser();
      this.info = data;
      return data;
    },

    /**
     * @description 获取用户菜单权限规则
     */
    async getRules() {
      // if (error === 0) {
      //   this.menuRules = data.menu; // 设置菜单规则
      //   this.pageRules = data.permission; // 设置页面权限
      //   this.apiRules = data.permission; // 设置功能权限
      //   return data;
      // }
    },

    /**
     * @description 退出登录
     * @param force
     */
    async logout(force = false) {
      let that = this;
      // if (!force) {
      //   await admin.account.logout();
      // }
      setTimeout(function () {
        that.info = {};
        that.setToken();
        that.setRules({ menu: [], page: [], api: [] });
        window.location = location.pathname;
      }, 0);
    },

    /**
     * @description 设置菜单规则
     * @param payload
     */
    setRules(payload) {
      this.menuRules = payload.menu; // 设置菜单规则
      this.pageRules = payload.permission; // 设置页面权限
      this.apiRules = payload.permission; // 设置功能权限
    },
  },
});
