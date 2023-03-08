import { onBeforeUpdate, ref } from "vue";
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
import $storage from "./spring/utils/storage";

import { registerGlobalComponents } from "./spring/components";
import { registerGlobalDirectives } from "./spring/directives";
import { loadTheme } from "./spring/hooks/useTheme";
import { useAppStore } from "./spring/store/app";
import { App } from "vue";
import { setSystemConfig, SpringOptions } from "./spring/config";
import "./spring/tailwind.css";

const spring = {
  $storage,
};
// 核心入口
export async function setupSpring(app: App, options: SpringOptions = {}) {
  app.provide("mitt", mitt);
  // 注册全局组件
  registerGlobalComponents(app);

  // 注册全局指令
  registerGlobalDirectives(app);

  setSystemConfig(options);

  // 主题
  loadTheme();

  // 系统初始化
  await useAppStore(pinia).init();
}

export default spring;
