<template>
  <el-main class="sa-p-b-0" v-loading="loading">
    <el-row :gutter="10" v-if="fileList.length > 0">
      <el-col v-for="item in fileList" :key="item" :xs="8" :sm="6" :md="4" :lg="3" :xl="3">
        <div class="file-item" :class="isSelected(item) != -1 ? 'file-item-selected' : ''">
          <div class="item-tools">
            <div class="item-select-more sa-flex sa-row-between">
              <el-checkbox
                v-if="!rename.flag || isSelected(item) != -1"
                :model-value="isSelected(item) != -1"
                @change="selectedFile(item)"
              ></el-checkbox>
              <el-icon
                v-if="!rename.flag"
                v-contextmenu:contextmenu="{ trigger: ['click'] }"
                @click="onContextmenu(item)"
              >
                <MoreFilled />
              </el-icon>
            </div>

            <!-- 重命名 -->
            <div v-if="rename.flag && contextmenuItem == item" class="item-rename sa-flex">
              <el-icon class="sa-m-r-4" @click="onConfirmRename">
                <Check />
              </el-icon>
              <el-icon class="close" @click="onCancelRename">
                <Close />
              </el-icon>
            </div>
          </div>
          <div
            class="item-icon"
            @click="selectedFile(item)"
            v-contextmenu:contextmenu
            @contextmenu.prevent.stop="onContextmenu(item)"
          >
            <template v-if="item.mimetype">
              <template v-if="item.mimetype.includes('image')">
                <sa-image size="80" :url="item.url" radius="8"></sa-image>
              </template>
              <type-icon v-if="!item.mimetype.includes('image')" :name="item.extension"></type-icon>
            </template>
          </div>
          <!-- 文件名称 -->
          <div class="item-title-content">
            <el-popover
              popper-class="sa-popper"
              trigger="hover"
              :show-arrow="false"
              :show-after="600"
            >
              <div class="title-popover">
                <div class="sa-flex">
                  <div class="label">标题：</div>
                  <div class="value sa-line-1">{{ item.filename }}</div>
                </div>
                <template v-if="item.mimetype">
                  <div v-if="item.mimetype.includes('image')" class="sa-flex">
                    <div class="label">宽度：</div>
                    <div class="value sa-line-1">{{ item.image_width }} px</div>
                  </div>
                  <div v-if="item.mimetype.includes('image')" class="sa-flex">
                    <div class="label">高度：</div>
                    <div class="value sa-line-1"> {{ item.image_height }} px </div>
                  </div>
                </template>
                <div class="sa-flex">
                  <div class="label">类型：</div>
                  <div class="value sa-line-1">{{ item.extension }}</div>
                </div>
                <div class="sa-flex">
                  <div class="label">大小：</div>
                  <div class="value sa-line-1">{{ item.filesize }} KB</div>
                </div>
                <div class="sa-flex">
                  <div class="label">储存引擎：</div>
                  <div class="value sa-line-1">{{ item.storage }}</div>
                </div>
                <div class="sa-flex">
                  <div class="label">上传日期：</div>
                  <div class="value sa-line-1">{{ item.create_time }}</div>
                </div>
                <div class="sa-flex">
                  <div class="label">更新日期：</div>
                  <div class="value sa-line-1">{{ item.update_time }}</div>
                </div>
              </div>
              <template #reference>
                <div>
                  <div v-if="!rename.flag || contextmenuItem != item" class="item-title sa-line-1">
                    {{ item.filename }}
                  </div>
                </div>
              </template>
            </el-popover>
            <el-input
              v-if="rename.flag && contextmenuItem == item"
              v-model="rename.name"
            ></el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <sa-empty v-if="fileList.length == 0"></sa-empty>

    <!-- 右键 -->
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item
        v-if="contextmenuItem.mimetype && contextmenuItem.mimetype.includes('image')"
        @click="onPreview"
        >查看</v-contextmenu-item
      >
      <v-contextmenu-item
        v-if="checkAuth('file.admin.file.delete')"
        class="delete-contextmenu"
        :class="isPopconfirm ? 'v-contextmenu-item--hover' : ''"
      >
        <span class="popconfirm-button" @click.stop="onPopconfirm(true)">删除</span>
        <div v-if="isPopconfirm" class="popconfirm-content">
          <div
            ><el-icon><QuestionFilled /></el-icon>确认删除?</div
          >
          <div class="action">
            <el-button size="small" link @click.stop="onPopconfirm(false)">取消</el-button>
            <el-button type="primary" size="small" @click="onDelete">确定</el-button>
          </div>
        </div>
      </v-contextmenu-item>
      <v-contextmenu-item
        v-if="
          contextmenuItem.mimetype &&
          contextmenuItem.mimetype.includes('image') &&
          checkAuth('file.admin.file.upload')
        "
        @click="onCropper"
        >裁剪</v-contextmenu-item
      >
      <v-contextmenu-item
        v-if="checkAuth('file.admin.file.rename') && contextmenuItem.filename"
        @click="onRename"
        >重命名</v-contextmenu-item
      >
      <v-contextmenu-item v-if="checkAuth('file.admin.file.move')" @click="onMove()"
        >移动</v-contextmenu-item
      >
    </v-contextmenu>

    <!-- 预览 -->
    <el-image-viewer
      v-if="previewVisible"
      @close="previewVisible = false"
      :url-list="[previewUrl]"
    />
  </el-main>
  <sa-view-bar>
    <template #left>
      <div v-if="type == 'index'" class="sa-flex">
        <span class="tip sa-m-r-12">
          已选择
          <span>{{ props.selected.length }}</span>
          项
        </span>
        <el-popover v-model:visible="deletePopoverVisible" placement="top" trigger="click">
          <el-checkbox v-model="is_real" label="1">是否删除文件</el-checkbox>
          <div class="delete-tools sa-flex sa-row-right">
            <el-button
              class="is-link"
              type="info"
              size="small"
              @click="deletePopoverVisible = false"
            >
              取消
            </el-button>
            <el-button class="is-link" type="primary" size="small" @click="onDelete('batch')"
              >确定</el-button
            >
          </div>
          <template #reference>
            <div>
              <el-button
                v-auth="'file.admin.file.delete'"
                class="sa-m-r-12"
                type="danger"
                plain
                :disabled="props.selected.length == 0"
                >删除</el-button
              >
            </div>
          </template>
        </el-popover>
        <el-button
          v-auth="'file.admin.file.move'"
          class="sa-m-r-12"
          type="primary"
          plain
          :disabled="props.selected.length == 0"
          @click="onMove('batch')"
          >移动</el-button
        >
      </div>
    </template>
    <template #right>
      <sa-pagination
        :pageData="page"
        layout="total, prev, pager, next"
        @updateFn="emit('updateFileList')"
      />
    </template>
  </sa-view-bar>
</template>
<script>
  import { directive } from 'v-contextmenu';
  import { cloneDeep } from 'lodash';
  export default {
    name: 'SelectItem',
    directives: {
      contextmenu: directive,
    },
  };
</script>
<script setup>
  import { reactive, ref } from 'vue';
  import fileApi from '../api';
  import { checkUrl } from '@/spring/utils/checkUrlSuffix';
  import { useModal } from '@/spring/hooks';
  import { ElMessage } from 'element-plus';
  import TypeIcon from './type-icon.vue';
  import MoveGroup from './move-group.vue';
  import FileCropper from './file-cropper.vue';
  import { checkAuth } from '@/spring/directives/auth';

  const emit = defineEmits(['updateFileList', 'updateSelected']);
  const props = defineProps({
    loading: {
      type: Boolean,
      default: true,
    },
    fileList: {
      type: Array,
      default: [],
    },
    page: {
      type: Object,
    },
    type: {
      type: String,
      default: 'index',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    max: {
      type: [String, Number],
    },
    leng: {
      type: [String, Number],
      default: 0,
    },
    selected: {
      type: Object,
    },
    group: {
      type: String,
    },
    savelog: {
      type: [String, Number],
    },
  });

  function selectedFile(item) {
    if (props.type == 'index') {
      isSelected(item) != -1
        ? props.selected.splice(isSelected(item), 1)
        : props.selected.push(item);
    }
    if (props.type == 'select') {
      // 单选
      if (!props.multiple) {
        props.selected.length = 0;
        isSelected(item) != -1
          ? props.selected.splice(isSelected(item), 1)
          : props.selected.push(item);
      }
      // 多选
      if (props.multiple) {
        // 限制
        if (props.max) {
          if (isSelected(item) == -1 && props.selected.length == props.max - props.leng) {
            ElMessage({
              message: '已到选择上限',
              type: 'warning',
            });
          }
          isSelected(item) != -1
            ? props.selected.splice(isSelected(item), 1)
            : props.selected.length < props.max - props.leng
            ? props.selected.push(item)
            : '';
        } else {
          // 不限制
          isSelected(item) != -1
            ? props.selected.splice(isSelected(item), 1)
            : props.selected.push(item);
        }
      }
    }
  }
  // checkbox选中
  function isSelected(item) {
    return props.selected.findIndex((s) => s.id == item.id);
  }

  // v-contextmenu 操作
  const contextmenuItem = ref('');
  function onContextmenu(item) {
    contextmenuItem.value = item;

    isPopconfirm.value = false;
  }

  // 查看/图片预览
  const previewVisible = ref(false);
  const previewUrl = ref(null);
  function onPreview() {
    previewUrl.value = checkUrl(contextmenuItem.value.url);
    previewVisible.value = true;
  }

  // 删除
  const is_real = ref(0);
  const deletePopoverVisible = ref(false);
  async function onDelete(type) {
    if (type == 'batch') {
      let ids = [];
      props.selected.forEach((i) => {
        ids.push(i.id);
      });
      await fileApi.delete(ids.join(','), is_real.value);
      deletePopoverVisible.value = false;
      is_real.value = 0;
      props.selected.length = 0;
    } else {
      await fileApi.delete(contextmenuItem.value.id);
    }

    isPopconfirm.value && (isPopconfirm.value = false);

    emit('updateFileList');
  }

  const isPopconfirm = ref(false);
  function onPopconfirm(type) {
    isPopconfirm.value = type;
  }

  // 裁剪
  function onCropper() {
    useModal(
      FileCropper,
      {
        title: '图片剪裁',
        type: 'select',
        cropper: contextmenuItem.value,
      },
      {
        confirm: async (res) => {
          var formData = new FormData();
          formData.append('file', res.data);
          await fileApi.upload({ group: props.group, savelog: props.savelog }, formData);
          emit('updateFileList');
        },
      },
    );
  }

  // 重命名
  function onRename() {
    const filename = cloneDeep(contextmenuItem.value.filename);
    const k = filename.lastIndexOf('.');
    rename.name = filename.substr(0, k);
    rename.flag = true;
  }
  const rename = reactive({
    name: '',
    flag: '',
  });
  async function onConfirmRename() {
    await fileApi.rename(contextmenuItem.value.id, { filename: rename.name });
    onCancelRename();
    emit('updateFileList');
  }
  function onCancelRename() {
    rename.flag = false;
  }

  // 移动
  function onMove(type) {
    useModal(
      MoveGroup,
      {
        title: '移动分组',
        class: 'filemanager-group-dialog',
      },
      {
        confirm: async (res) => {
          if (type == 'batch') {
            let ids = [];
            props.selected.forEach((d) => {
              ids.push(d.id);
            });
            await fileApi.move(ids.join(','), { group: res.data });
            props.selected.length = 0;
          } else {
            await fileApi.move(contextmenuItem.value.id, { group: res.data });
          }
          emit('updateFileList');
        },
      },
    );
  }
</script>
<style lang="scss" scoped>
  .file-item {
    margin: 0 0 24px 0;
    padding: 12px 12px 8px;
    border-radius: 8px;

    .item-tools {
      height: 20px;
      margin-bottom: 4px;
      position: relative;
      .el-icon {
        font-size: 14px;
        &:hover {
          color: var(--el-color-primary);
        }
        &.close {
          &:hover {
            color: #ff4d4f;
          }
        }
      }
      .item-select-more {
        height: 20px;
        display: none;
      }
      .item-rename {
        height: 20px;
        background: var(--sa-background-assist);
        border-radius: 2px;
        padding: 0 4px;
        position: absolute;
        top: 0;
        right: 0;
      }
    }

    .item-icon {
      width: 100%;
      padding: 100% 0 0;
      margin-bottom: 4px;
      position: relative;
      cursor: pointer;
      .sa-image {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
      .sa-image,
      .el-image {
        width: inherit !important;
        height: inherit !important;
      }
    }
    .item-title-content {
      height: 32px;
      line-height: 32px;
      .title-popover {
        & > div {
          margin: 0 0 4px 0;
        }
      }
      .item-title {
        width: inherit;
        font-size: 14px;
        text-align: center;
      }
    }

    &:hover {
      background: var(--t-bg-hover);
      border-radius: 8px;
      .item-select-more {
        display: flex;
      }
    }
    &.file-item-selected {
      background: var(--t-bg-hover);
      .item-select-more {
        display: flex;
      }
    }
  }
  .sa-view-bar {
    box-shadow: none !important;
    .tip {
      font-size: 12px;
      color: var(--sa-font);
    }
  }
  .delete-tools {
    height: 16px;
    .cancel {
      color: var(--sa-subfont);
      margin-right: 16px;
    }
  }
</style>

<style lang="scss">
  .delete-contextmenu {
    padding: 0 !important;
    .popconfirm-button {
      padding: 5px 14px;
      width: 100%;
    }
    .popconfirm-content {
      position: absolute;
      width: fit-content;
      min-width: 150px;
      height: 70px;
      background: var(--sa-background-assist);
      top: -40px;
      right: 50%;
      margin-right: -72px;
      padding: 12px;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      color: var(--sa-subtitle);
      .el-icon {
        color: rgb(255, 153, 0);
        margin-right: 5px;
      }
      .action {
        margin-top: 8px;
        text-align: right;
      }
    }
  }
</style>
