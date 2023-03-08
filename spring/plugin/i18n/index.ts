import { App } from "vue";
import { createI18n } from "vue-i18n";
// import en from '@/locales/en.json';
// import zh from '@/locales/zh.json';
import springEn from "./locales/en.json";
import springZh from "./locales/zh.json";

const messages = {
  en: {
    ...springEn,
    // ...en,
  },
  zh: {
    ...springZh,
    // ...zh,
  },
};
const i18n = createI18n({
  locale: "zh", // set locale
  legacy: false,
  allowComposition: true,
  fallbackLocale: "zh", // set fallback locale
  messages, // set locale messages
  missing(locale, key) {
    if (import.meta.env.MODE === "development") {
      console.warn(`在"${locale}"语言环境中，"${key}"关键字没有配置`);
    }
    const arr = key.split(".");
    return arr[arr.length - 1];
  },
});
export function setupI18n(
  app: App,
  messages: { zh: any; en: any } = { zh: {}, en: {} }
) {
  app.use(i18n);
}
