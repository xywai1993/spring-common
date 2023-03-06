// 设置请求基础配置
let baseURL;
switch (import.meta.env.MODE) {
  case 'development':
    baseURL = import.meta.env.SPRING_DEV_BASE_URL;
    break;
  case 'development-mock':
    baseURL = import.meta.env.SPRING_DEV_MOCK_URL;
    break;
  default:
    baseURL = import.meta.env.SPRING_BASE_URL;
}

const version = import.meta.env.SPRING_VERSION;

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

export const setting = {
  /**
   * 开启多语言
   */
  multiLanguage: false,
  chat: false,
  notice: false,
};

export { baseURL, version };
