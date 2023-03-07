<template>
  <div class="sa-uploader" :style="{ width: mode === 'input' ? '100%' : '' }">
    <template v-if="mode === 'cert'">
      <uploader-cert
        :url="modelValue"
        :placeholder="placeholder"
        @success="onSuccess"
      ></uploader-cert>
    </template>
    <template v-if="mode === 'card'">
      <uploader-card
        :url="url"
        :action="action"
        :savelog="saveLog"
        :group="group"
        :fileType="fileType"
        :multiple="multiple"
        :max="max"
        :size="size"
        @success="onSuccess"
      ></uploader-card>
    </template>
    <template v-if="mode === 'input'">
      <uploader-input
        :url="url"
        :action="action"
        :savelog="saveLog"
        :group="group"
        :fileType="fileType"
        :multiple="multiple"
        :max="max"
        @success="onSuccess"
      ></uploader-input>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: "SpUploader",
};
</script>

<script lang="ts" setup>
/**
 * SaUploader  通用文件上传组件
 * @description 本组件用于文件上传场景，内嵌表单
 *
 * @property {String | Array}   modelValue      文件地址
 * @property {String | Array}   fileType        文件类型 默认 emptyString=全部
 * @property {String}           mode           风格 （ 'input'=输入框(默认) | 'card'=图片预览 ）
 * @property {String}           action          操作（ 'select'=选择文件 (默认) | 'upload'=直接上传 | 'directly'=原生上传 ）
 * @property {String | Number}  savelog         是否保存到文件管理可供选择 默认1，
 * @property {String}           group           上传的文件管理分组
 * @property {Boolean}          multiple         是否支持多文件上传 默认false
 * @property {String | Number}  max             最大文件数量 默认0不限制
 * @property {Boolean}          icon            是否显示选择图标 默认false（只有在input）
 * @property {String}           text            显示选择文案 默认 "选择"（只有在input）
 * @property {String}           size            item尺寸
 * @property {String}           placeholder     提示文本
 * @event    {Function}        update:modelValue 更新表单
 * @example  <sa-uploader></sa-uploader>
 */

import UploaderCard from "./uploader-card.vue";
import UploaderCert from "./uploader-cert.vue";
import UploaderInput from "./uploader-input.vue";
import { FileManagerInterface } from "../sa-file/type";

const emit = defineEmits(["update:modelValue"]);
console.log("test111222");
const props = withDefaults(
  defineProps<{
    modelValue: string | string[];
    mode?: "input" | "card" | "cert";
    placeholder?: string;
    fileType?: "all" | "image" | "audio" | "video" | "other";
    action?: FileManagerInterface["action"];
    saveLog?: FileManagerInterface["savelog"];
    /**
     * 分组id
     */
    group?: string | number;
    multiple?: boolean;
    max?: number;
    /**
     * 是否显示选择图标 默认false（只有在input）
     */
    icon?: boolean;
    text?: string;
    size?: number;
  }>(),
  {
    placeholder: "请上传证书",
    fileType: "all",
    mode: "input",
    action: "select",
    saveLog: 1,
    group: 1,
    multiple: false,
    max: 0,
    icon: true,
    text: "选择",
    size: 56,
  }
);

function onSuccess(value) {
  emit("update:modelValue", value);
}
</script>
