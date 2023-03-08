// 设置请求基础配置
let baseURL;
switch (import.meta.env.MODE) {
  case "development":
    baseURL = import.meta.env.SPRING_DEV_BASE_URL;
    break;
  case "development-mock":
    baseURL = import.meta.env.SPRING_DEV_MOCK_URL;
    break;
  default:
    baseURL = import.meta.env.SPRING_BASE_URL;
}

/**
 * 菜单设置
 * @type {{subMenu: boolean, serverMenus: boolean}}
 */
export const menusSetting = {
  /**
   * 是否需要拉取服务端菜单
   */
  serverMenus: false,
  /**
   * 是否需要多级菜单
   */
  subMenu: false,
};

export let setting = {
  /**
   * 开启多语言
   */
  multiLanguage: false,
  chat: false,
  notice: false,
  /**
   * 是否需要拉取服务端菜单
   */
  serverMenus: false,
  /**
   * 是否需要多级菜单
   */
  subMenu: false,
};

export interface SpringOptions {
  /**
   * 是否需要拉取服务端菜单
   */
  serverMenus?: boolean;
  /**
   * 是否需要多级菜单
   */
  subMenu?: boolean;
  /**
   * 开启多语言
   */
  multiLanguage?: boolean;
  chat?: boolean;
  notice?: boolean;
}

export function setSystemConfig(options: SpringOptions = {}) {
  setting = Object.assign(
    {
      multiLanguage: false,
      chat: false,
      notice: false,
      serverMenus: false,
      subMenu: false,
    },
    options
  );
}

export { baseURL };
