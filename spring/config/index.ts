// 设置请求基础配置

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
  baseUrl: "",
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
  baseUrl?: string;
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
      baseUrl: "",
      multiLanguage: false,
      chat: false,
      notice: false,
      serverMenus: false,
      subMenu: false,
    },
    options
  );

  console.log(setting);
}
