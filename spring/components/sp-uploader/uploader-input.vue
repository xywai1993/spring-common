<template>
  <div class="uploader-input">
    <uploader-item
      :urlList="urlList.data"
      :multiple="multiple"
      :fileType="fileType"
      :size="size"
      @action="onUpdata"
    ></uploader-item>
    <div class="input-item sa-flex">
      <el-input
        class="url-input"
        v-model="inputUrl"
        @change="emit('success', inputUrl)"
      ></el-input>
      <div class="svg" @click.stop="onSelect">选择图标</div>
      <uploader-action
        :urlList="urlList.data"
        :action="action"
        :savelog="savelog"
        :multiple="multiple"
        :max="max"
        :fileType="fileType"
        :size="size"
        @action="onUpdata"
      >
        <template #action>
          <div class="image">上传图片</div>
        </template>
      </uploader-action>
    </div>
  </div>
</template>
<script>
export default {
  name: "UploaderInput",
};
</script>
<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useModal } from "../../hooks";
import { isEmpty, isArray } from "lodash";
import UploaderAction from "./uploader-action.vue";
import UploaderItem from "./uploader-item.vue";
import IconPicker from "../sa-icon/sa-icon-picker.vue";

const emit = defineEmits(["success"]);
const props = defineProps([
  "url",
  "action",
  "savelog",
  "group",
  "fileType",
  "multiple",
  "max",
  "size",
]);

const inputUrl = ref(props.url);
watch(
  () => props.url,
  () => {
    inputUrl.value = props.url;
  }
);

const urlList = reactive({
  data: computed(() =>
    !isEmpty(props.url)
      ? isArray(props.url)
        ? props.url
        : props.url.split(",")
      : []
  ),
});

function onUpdata(urlList) {
  emit(
    "success",
    props.multiple ? urlList : urlList.length > 0 ? urlList[0] : ""
  );
}

function onSelect() {
  useModal(
    IconPicker,
    {
      title: "选择图标",
    },
    {
      confirm: (res) => {
        emit("success", res.data);
      },
    }
  );
}
</script>
<style lang="scss" scoped>
.input-item {
  width: 100%;
  max-width: 360px;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--sa-border);
  border-radius: 4px;
  overflow: hidden;

  :deep() {
    .el-input {
      --el-input-border: none;
      --el-input-border-color: none;
      line-height: 30px;

      .el-input__inner {
        height: 30px;
        line-height: 30px;
        border-radius: 4px 0 0 4px;
      }
    }
  }

  .url-input {
    flex: 1;

    .el-tooltip__trigger {
      flex: 1;
    }
  }

  .svg {
    border-left: 1px solid var(--sa-border);
  }

  .image {
    border-left: 1px solid var(--sa-border);
  }

  .svg,
  .image {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
