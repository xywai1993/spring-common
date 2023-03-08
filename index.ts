// 极验
import "./spring/utils/gt";
// 图片剪裁
import "cropperjs/dist/cropper.css";
// 事件通讯
import mitt from "./spring/utils/mitt";
// svg图标注册
import "virtual:svg-icons-register";
// 时间格式化
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
dayjs.locale("zh-cn");
dayjs.extend(relativeTime);

import { pinia } from "./spring/store";
import { registerGlobalComponents } from "./spring/components";
import { registerGlobalDirectives } from "./spring/directives";
import { loadTheme } from "./spring/hooks/useTheme";
import { useAppStore } from "./spring/store/app";
import { App } from "vue";
import { setting, SpringOptions } from "./spring/config";
import "./spring/tailwind.css";

// 核心入口
export async function setupSpring(app: App) {
  app.provide("mitt", mitt);
  // 注册全局组件
  registerGlobalComponents(app);

  // 注册全局指令
  registerGlobalDirectives(app);

  // setSystemConfig(options);

  // 主题
  loadTheme();

  // 系统初始化
  await useAppStore(pinia).init();
}

export function setSystemConfig(options: SpringOptions = {}) {
  for (const option in options) {
    if (Object.hasOwn(setting, option)) {
      setting[option] = options[option];
    }
  }

  console.log(setting, "???");
}

export { setupI18n } from "./spring/plugin/i18n";
export { setupStore } from "./spring/store";
export { setupRouter } from "./spring/router";
