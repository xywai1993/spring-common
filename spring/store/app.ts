/**
 * @description 应用数据、加载
 */

import $storage from '@/spring/utils/storage';
import { getBrowser } from '@/spring/utils';
import { defineStore } from 'pinia';
import { getSiteConf } from '@/spring/api';

const browser = getBrowser();

const app = defineStore({
  id: 'app',
  persist: {
    key: `${import.meta.env.SPRING_CACHE_PREFIX}store-app`,
    paths: ['info', 'layout', 'currentAppName', 'language'],
  },
  state: () => ({
    inited: false, // 应用加载状态
    info: {
      // 站点信息
      host: '',
      order_prefix: 'MAC',
      root_id: 1,
      site_desc: '',
      site_logo: '',
      site_name: 'Spring',
    },
    layout: {
      // 布局
      showTaskbar: true, // 是否显示任务栏
      collapse: browser.isMini,
      theme: 'element', // 主题
      darkMode: '', // 暗黑模式 light | dark | system
      pageLoading: false,
    },
    browser,
    taskbar: {
      list: [], // 任务栏列表
      history: [], // 任务栏访问历史
    },
    currentAppName: '',
    requestCounter: 0, // 请求计数器
    language: 'zh',
  }),
  getters: {
    // 应用配置
    all: (state) => state,
  },
  actions: {
    /**
     * @description 初始化信息
     */
    async init() {
      getSiteConf().then((d) => {
        this.info = d.data;
      });
      await this.appLoad();
    },

    /**
     * @description 加载app
     * @param {*} route
     */
    appLoad() {
      // const account = useAccountStore();
      // account.getInfo().then();
      // await account.getRules();
      this.inited = true;
    },

    changeApp(name) {
      this.currentAppName = name;
    },

    /**
     * @description 设置主题
     * @param {*} name
     */
    setTheme(name = '') {
      this.layout.theme = name;
      $storage.set('theme', name);
    },

    /**
     * @description 设置暗黑模式
     * @param {*} name
     */
    setDarkMode(name = '') {
      this.layout.darkMode = name;
      $storage.set('darkMode', name);
    },

    /**
     * @description 设置任务栏列表
     * @param {*} payload
     */
    setTaskbar(payload) {
      this.taskbar = payload;
    },

    // 收起左侧菜单
    menuCollapse(val = false) {
      this.layout.collapse = val;
    },

    // 页面加载
    setPageLoading() {
      let that = this;
      that.layout.pageLoading = true;
      setTimeout(() => {
        that.layout.pageLoading = false;
      }, 500);
    },

    // 设置请求计数器
    setRequestCounter(num) {
      this.requestCounter += num;
      if (this.requestCounter <= 0) {
        this.requestCounter = 0;
      }
    },
    setLanguage(l: 'zh' | 'en') {
      this.language = l;
    },
  },
});

export default app;
export const useAppStore = app;
