<template>
  <div class="sa-editor">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
    <Editor
      style="height: 400px; overflow-y: hidden"
      :defaultConfig="editorConfig"
      :mode="mode"
      v-model="valueHtml"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { useFile } from "../../hooks";
import { checkUrl } from "../../utils/checkUrlSuffix";

const emits = defineEmits(["update:content"]);
const props = defineProps(["content"]);

const mode = "default";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref(props.content);
watch(
  () => props.content,
  () => {
    valueHtml.value = props.content;
    nextTick(() => {
      editorRef.value.focus();
    });
  }
);

const toolbarConfig = {};

const editorConfig = { MENU_CONF: {} };
editorConfig.MENU_CONF["uploadImage"] = {
  // 自定义选择图片
  customBrowseAndUpload(insertFn) {
    useFile(
      {
        fileType: "image",
        multiple: true,
      },
      {
        confirm: (data) => {
          data.forEach((item) => {
            insertFn(checkUrl(item.url), "", ""); // url alt href
          });
        },
      }
    );
  },
};
editorConfig.MENU_CONF["uploadVideo"] = {
  // 自定义选择视频
  customBrowseAndUpload(insertFn) {
    useFile(
      {
        fileType: "video",
        multiple: true,
      },
      {
        confirm: (data) => {
          data.forEach((item) => {
            insertFn(checkUrl(item.url), ""); // url poster
          });
        },
      }
    );
  },
};

// 编辑器回调函数
const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例
};
const handleChange = (editor) => {
  emits("update:content", editor.getHtml());
};

onMounted(() => {
  nextTick(() => {
    editorRef.value.focus();
  });
});

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});
</script>

<style lang="scss" scoped>
.sa-editor {
  border: 1px solid var(--sa-border);
  :deep() {
    .w-e-bar {
      border-bottom: 1px solid var(--sa-border);
    }
  }
}
</style>
