<template>
  <div class="uploader-action">
    <div v-if="action == 'select' || action == 'upload'" @click="uploadFile">
      <slot name="action">
        <div
          v-if="
            (!multiple && !urlList.length) ||
            (multiple && (!max || urlList.length < max))
          "
          class="card-icon"
          :style="{
            width: size + 'px',
            height: size + 'px',
            margin: !multiple ? '0' : '',
          }"
        >
          <el-icon :style="{ 'font-size': size / 3 + 'px' }">
            <Plus />
          </el-icon>
        </div>
      </slot>
    </div>
    <template v-if="action == 'directly'">
      <el-upload
        action
        :http-request="uploadFile"
        :on-exceed="onExceed"
        :show-file-list="false"
        :multiple="multiple"
        :limit="max - urlList.length"
      >
        <slot name="action">
          <div
            v-if="
              (!multiple && !urlList.length) ||
              (multiple && (!max || urlList.length < max))
            "
            class="card-icon"
            :style="{
              width: size + 'px',
              height: size + 'px',
              margin: !multiple ? '0' : '',
            }"
          >
            <el-icon :style="{ 'font-size': size / 3 + 'px' }">
              <Plus />
            </el-icon>
          </div>
        </slot>
      </el-upload>
    </template>
  </div>
</template>

<script>
export default {
  name: "UploaderAction",
};
</script>

<script setup>
import admin from "./index";
import { useFile } from "../../hooks";
import { ElMessage } from "element-plus";

const emit = defineEmits(["action"]);
const props = defineProps([
  "urlList",
  "action",
  "savelog",
  "group",
  "fileType",
  "multiple",
  "max",
  "size",
]);

async function uploadFile(file) {
  if (props.action == "select" || props.action == "upload") {
    useFile(
      {
        type: "select",
        action: props.action,
        savelog: props.savelog,
        fileType: props.fileType,
        multiple: props.multiple,
        max: props.max,
        leng: props.urlList.length,
      },
      {
        confirm: (data) => {
          if (props.multiple) {
            data.forEach((d) => {
              props.urlList.push(d.url);
            });
          } else {
            props.urlList.length = 0;
            props.urlList.push(data.url);
          }
          emit("action", props.urlList);
        },
      }
    );
  } else if (props.action == "directly") {
    var formData = new FormData();
    formData.append("file", file.file);
    const { error, data } = await admin.file.upload(
      { group: props.group, savelog: props.savelog },
      formData
    );
    if (error == 0) props.urlList.push(data.path);
    emit("action", props.urlList);
  }
}

function onExceed(file) {
  if (file.length > props.max - props.urlList.length) {
    ElMessage({
      message: "已到文件上限",
      type: "warning",
    });
  } else {
    file.forEach(async (f) => {
      var formData = new FormData();
      formData.append("file", f);
      const { error, data } = await admin.file.upload(
        { group: props.group, savelog: props.savelog },
        formData
      );
      if (error == 0) props.urlList.push(data.path);
    });

    emit("action", props.urlList);
  }
}
</script>

<style lang="scss" scoped>
.uploader-card {
  .card-icon {
    color: var(--sa-place);
    border: 1px dashed var(--sa-border);
    border-radius: 4px;
    margin: 0 8px 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>
