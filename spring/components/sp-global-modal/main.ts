/**
 * @update  2023年02月14日15:32:34  现已支持多个modal在同一个页面显示
 */

import { isString } from "lodash";
import { buildShortUUID } from "../../utils";
import { markRaw, ref, shallowRef, triggerRef } from "vue";

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
  id: "",
  component: {},
  dialog: {
    title: "",
  },
  params: {},
  show: false,
  fullscreen: false,
  minimize: false,
  callback: {},
});

export const modalList = shallowRef<ModalType[]>([]);

export const useGlobalModal = async (options: {
  component: ModalType["component"];
  params?: ModalType["params"];
  dialog?: ModalType["dialog"];
  callback?: ModalType["callback"];
}) => {
  let com = null;
  if (isString(options.component)) {
    com = await import(/* @vite-ignore */ options.component);
  } else {
    com = markRaw(options.component);
  }

  modalList.value.push({
    id: buildShortUUID("modal"),
    component: com,
    params: options.params ?? {},
    dialog: options.dialog,
    show: true,
    fullscreen: false,
    minimize: false,
    callback: options.callback ?? {},
  });
  triggerRef(modalList);

  // modal.value = {
  //   id: buildShortUUID('modal'),
  //   component: com,
  //   params: options.params ?? {},
  //   dialog: options.dialog,
  //   show: true,
  //   fullscreen: false,
  //   minimize: false,
  //   callback: options.callback ?? {},
  // };
};
