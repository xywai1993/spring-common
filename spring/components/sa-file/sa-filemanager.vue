<template>
  <el-container class="sa-filemanager panel-block">
    <!-- 文件类型 -->
    <el-header class="sa-header">
      <el-tabs v-model="state.search.file_type">
        <template v-for="titem in state.fileType" :key="titem">
          <!-- 1.index全显示 2.select根据fileType显示 -->
          <el-tab-pane
            v-if="
              type == 'index' ||
              (type == 'select' && inFileType.includes(titem.value))
            "
            :label="titem.name"
            :name="titem.value"
          ></el-tab-pane>
        </template>
      </el-tabs>
    </el-header>
    <el-main class="sa-p-0">
      <el-container>
        <!-- 文件分组 -->
        <el-aside class="group-pc">
          <file-group
            v-model="state.search.group"
            :groupList="state.fileGroup"
            @updateGroupList="getFileGroup"
          ></file-group>
        </el-aside>
        <el-container>
          <!-- 文件分组 Phone-->
          <el-header class="group-phone">
            <file-group
              v-model="state.search.group"
              :groupList="state.fileGroup"
              @updateGroupList="getFileGroup"
            ></file-group>
          </el-header>
          <el-main class="sa-p-0">
            <el-container>
              <el-header class="sa-flex sa-row-between">
                <div>
                  <el-input
                    v-if="action == 'select'"
                    v-model="state.search.filename"
                    placeholder="请输入文件名称"
                    @input="debounceFile"
                  ></el-input>
                </div>
                <el-button
                  v-if="action == 'select'"
                  type="primary"
                  @click="onChangeAction('upload')"
                  >上传文件</el-button
                >
                <el-button
                  v-if="action == 'upload'"
                  @click="onChangeAction('select')"
                  >返回文件列表</el-button
                >
              </el-header>

              <!-- 选择文件 -->
              <select-item
                v-if="action == 'select'"
                :loading="state.loading"
                :fileList="state.fileList"
                v-model:page="state.pageData"
                @updateFileList="getFile"
                :type="type"
                :multiple="multiple"
                :max="max"
                :leng="leng"
                v-model:selected="state.selected"
                :group="state.search.group"
                :savelog="savelog"
              >
              </select-item>

              <!-- 上传文件 -->
              <file-upload
                v-if="action == 'upload'"
                :group="state.search.group"
                :savelog="savelog"
                @onChangeAction="onChangeAction"
              ></file-upload>
            </el-container>
          </el-main>
        </el-container>
      </el-container>
    </el-main>
    <el-footer
      class="sa-filemanager__footer"
      v-if="type == 'select' && action == 'select'"
    >
      <el-button @click="callback" type="primary">确定</el-button>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  name: "SaFilemanager",
};
</script>
<script setup>
/**
 * SaFilemanager  通用文件
 * @description 本组件用于选择上传文件，文件管理
 *
 * @property {String}           type            使用类型 index=文件管理 | select=选择
 * @property {String | Array}   fileType        文件类型 默认all
 * @property {String}           action          操作 select=选择文件模块 (默认) | upload=直接上传模块
 * @property {String | Number}  savelog         是否保存到文件管理1，
 * @property {Boolean}          multiple        是否支持多文件上传 默认false
 * @property {String | Number}  max             最大文件数量 默认0不限制
 */
import { computed, onMounted, reactive, ref, watch } from "vue";
import fileApi from "./api";
import { debounce, composeFilter } from "../../utils";
import { isArray } from "lodash";
import FileGroup from "./components/file-group.vue";
import SelectItem from "./components/select-item.vue";
import FileUpload from "./components/file-upload.vue";

const emit = defineEmits(["callback"]);
const props = defineProps({
  params: {
    type: Object,
    default: {
      // (默认文件管理参数)
      type: "index",
      fileType: "all", // (数组/字符串)
      action: "select",
      savelog: 1, // 是否存记录
      multiple: true,
    },
  },
});

const { type, fileType, savelog, multiple, max, leng } = props.params;

const state = reactive({
  fileType: [
    {
      name: "全部",
      value: "all",
    },
    {
      name: "图片",
      value: "image",
    },
    {
      name: "音频",
      value: "audio",
    },
    {
      name: "视频",
      value: "video",
    },
    {
      name: "其它",
      value: "other",
    },
  ],
  fileGroup: [],
  loading: false,
  fileList: [],
  search: {
    file_type: "all",
    group: "default",
    filename: "",
  },
  pageData: {
    page: 1,
    list_rows: 24,
    total: 0,
  },
  selected: [],
});

const inFileType = computed(() =>
  isArray(fileType) ? fileType : [fileType || "all"]
);
state.search.file_type = inFileType.value[0];

const action = ref(props.params.action || "select");
function onChangeAction(val) {
  action.value = val;
  getFile();
}

async function getFileGroup() {
  const { error, data } = await fileApi.group.list();
  if (error === 0) {
    state.fileGroup = data;
  }
}

async function getFile() {
  state.loading = true;
  const { error, data } = await fileApi.list({
    page: state.pageData.page,
    list_rows: state.pageData.list_rows,
    ...composeFilter(state.search, { filename: "like" }),
    order: "desc",
    sort: "update_time",
  });
  if (error === 0) {
    state.fileList = data.data;
    state.pageData.total = data.total;
    state.pageData.page = data.current_page;
  }
  state.loading = false;
}
let debounceFile = debounce(function () {
  state.pageData.page = 1;
  getFile();
}, 500);

// 监听 文件类型/分组
watch([() => state.search.group, () => state.search.file_type], () => {
  state.pageData.page = 1;
  getFile();
});

// 确定回传选中文件
function callback() {
  emit("callback", {
    event: "confirm",
    data: multiple ? state.selected : state.selected[0],
  });
  state.selected = [];
}

onMounted(() => {
  getFileGroup();
  getFile();
});
</script>

<style lang="scss" scoped>
.sa-filemanager {
  color: var(--sa-font);
  margin: 0 -16px;
  .el-container {
    height: 100%;
  }
  .sa-header {
    padding: 0 var(--sa-padding);
    line-height: 60px;
    :deep() {
      .el-tabs__header {
        margin: 0;
      }
    }
  }

  @media only screen and (min-width: 768px) {
    .group-pc {
      width: 170px;
      flex-shrink: 0;
      border-right: 1px solid var(--sa-border);
    }
    .group-phone {
      display: none;
    }
  }
  @media only screen and (max-width: 768px) {
    .group-pc {
      display: none;
    }
    .group-phone {
      display: flex;
      --el-header-height: auto;
    }
  }

  &__footer {
    line-height: 60px;
    text-align: right;
    padding: 0 24px !important;
    border-top: 1px solid var(--sa-border);
  }
}
.sa-dialog {
  .sa-filemanager {
    color: var(--sa-font);
    margin: 0;
  }
}
</style>
