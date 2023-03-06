import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { isEmpty } from 'lodash';

export function registerGlobalComponents(app) {
  const globalComponents = import.meta.glob('./**/*.global.vue', { eager: true });
  Object.keys(globalComponents).forEach((key) => {
    const component = globalComponents[key].default;
    if (!isEmpty(component)) {
      app.component(component.name, component);
    }
  });

  // @element-plus/icons-vue 全局注册
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
