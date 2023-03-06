import { markRaw, reactive } from 'vue';
import { isString } from 'lodash';

export type DrawerOptions = {
  comp?: string | object;
  filterParams?: any;
  confirm: (d: any) => void;
  reset: (d: any) => void;
  close: (d: any) => void;
};

export type DrawerModalType = {
  show: boolean;
  componentId: string | object;
  params: any;
};

// 回调方法
export const cb = {
  confirm: (d) => {},
  reset: (d) => {},
  close: (d) => {},
};

export const modal = reactive<DrawerModalType>({
  show: false,
  params: {},
  componentId: '',
});
export function useDrawer(options: DrawerOptions) {
  // @ts-ignore
  modal.componentId = isString(options.comp) ? markRaw(options.comp) : 'sa-search';
  modal.show = true;
  cb.confirm = options.confirm;
  cb.reset = options.reset;
  cb.close = options.close;
  modal.params = options?.filterParams;
  // return useDrawer;
}
