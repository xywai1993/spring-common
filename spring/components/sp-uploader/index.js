import { request } from "../../request";
import { isEmpty } from "lodash";
import { CRUD } from "../../request/crud";

export default {
  // 系统初始化
  init: () =>
    request(
      {
        url: "site/config",
      },
      {
        isGetDataDirectly: false,
      }
    ),

  // 获取验证码
  captcha: () =>
    request({
      url: "admin/index/captcha",
      method: "GET",
    }),
  // 登录配置
  loginConfig: () =>
    request({
      url: "admin/index/loginConfig",
    }),

  // 清空后端缓存
  clearCache: () =>
    request({
      url: "admin/index/clearCache",
      method: "POST",
    }),
  // 账号信息
  account: {
    // 登录
    login: (data) =>
      request({
        url: "auth/login",
        method: "POST",
        data,
        options: {
          showSuccessMessage: true,
        },
      }),
    // 登出
    logout: () =>
      request({
        url: "admin/index/logout",
      }),
    // 个人信息
    info: () =>
      request(
        {
          url: "/auth/me",
        },
        {
          isGetDataDirectly: false,
        }
      ),
    // 菜单权限
    rules: () =>
      request(
        {
          url: "admin/index/rules",
        },
        {
          isGetDataDirectly: false,
        }
      ),
    // 更新个人信息
    update: (data) =>
      request({
        url: "admin/index/update",
        method: "PUT",
        data,
        options: {
          showSuccessMessage: !isEmpty(data),
        },
      }),
    // 当前管理员操作日志
    adminLog: (params) =>
      request({
        url: "admin/index/adminLog",
        method: "GET",
        params,
      }),
  },

  // 权限设置
  auth: {
    // 管理员
    admin: {
      ...CRUD("admin/auth/admin"),
    },
    // 角色管理
    role: {
      // 角色组
      ...CRUD("admin/auth/role"),
      select: () =>
        request({
          url: "admin/auth/role/select",
          method: "GET",
        }),
    },
    // 菜单权限
    access: {
      ...CRUD("admin/auth/access"),
      list: (params) =>
        request({
          url: "admin/auth/access",
          method: "GET",
          params,
        }),
      select: (params) =>
        request({
          url: "admin/auth/access/select",
          method: "GET",
          params,
        }),
    },
    adminLog: {
      ...CRUD("admin/auth/adminLog"),
    },
  },
  // 系统设置
  config: {
    // 基础配置
    basic: {
      // 站点配置
      site: (data) =>
        request({
          url: "admin/config/basic/site",
          method: isEmpty(data) ? "GET" : "PUT",
          data,
          options: {
            showSuccessMessage: !isEmpty(data),
          },
        }),
      // 登录配置
      login: (data) =>
        request({
          url: "admin/config/basic/login",
          method: isEmpty(data) ? "GET" : "PUT",
          data,
          options: {
            showSuccessMessage: !isEmpty(data),
          },
        }),
      // 用户配置
      user: (data) =>
        request({
          url: "admin/config/basic/user",
          method: isEmpty(data) ? "GET" : "PUT",
          data,
          options: {
            showSuccessMessage: !isEmpty(data),
          },
        }),
      // 邮件配置
      mail: (data) =>
        request({
          url: "admin/config/basic/mail",
          method: isEmpty(data) ? "GET" : "PUT",
          data,
          options: {
            showSuccessMessage: !isEmpty(data),
          },
        }),
    },
    //  短信配置
    easysms: (data) =>
      request({
        url: "admin/config/easysms",
        method: isEmpty(data) ? "GET" : "PUT",
        data,
        options: {
          showSuccessMessage: !isEmpty(data),
        },
      }),
  },
  notification: {
    config: (id, type, data) =>
      request({
        url: `admin/notification/config/${id}${type ? "/" + type : ""}`,
        method: isEmpty(data) ? "GET" : "PUT",
        data,
        options: {
          showSuccessMessage: !isEmpty(data),
        },
      }),
    getTemplateId: (id, type, params) =>
      request({
        url: "admin/notification/config/getTemplateId/" + id + "/" + type,
        method: "GET",
        params,
      }),
    setStatus: (id, type, data) =>
      request({
        url: "admin/notification/config/setStatus/" + id + "/" + type,
        method: "PUT",
        data,
      }),
  },
};
