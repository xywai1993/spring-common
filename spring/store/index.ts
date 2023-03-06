import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
export function setupStore(app) {
  app.use(pinia);
}
