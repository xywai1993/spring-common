import { isString } from 'lodash';
import { buildShortUUID } from '@/spring/utils';
import { markRaw, ref } from 'vue';

export type ModalType = {
  id: string;
  component: any;
  // 业务参数
  params: {
    [prop: string]: any;
  };
  dialog?: {
    title?: string;
    /**
     * 是否需要遮罩
     */
    modal?: boolean;
    class?: string;
    /**
     * 关闭时是否销毁组件
     * @default true
     */
    destroyModal?: boolean;
  };
  show: boolean;
  fullscreen: boolean;
  minimize: boolean;
  callback: {
    fullscreen?: () => void;
    close?: () => void;
    [prop: string]: ((d: any) => void) | undefined;
  };
};

export const modal = ref<ModalType>({
  id: '',
  component: {},
  dialog: {
    title: '',
  },
  params: {},
  show: false,
  fullscreen: false,
  minimize: false,
  callback: {},
});

export const useGlobalModal = async (options: {
  component: ModalType['component'];
  params?: ModalType['params'];
  dialog?: ModalType['dialog'];
  callback?: ModalType['callback'];
}) => {
  let com = null;
  if (isString(options.component)) {
    com = await import(/* @vite-ignore */ options.component);
  }
  com = markRaw(options.component);

  modal.value = {
    id: buildShortUUID('modal'),
    component: com,
    params: options.params ?? {},
    dialog: options.dialog,
    show: true,
    fullscreen: false,
    minimize: false,
    callback: options.callback ?? {},
  };
};
