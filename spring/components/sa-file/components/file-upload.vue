<template>
  <el-main>
    <el-upload
      class="file-upload"
      drag
      multiple
      list-type="picture-card"
      action
      ref="uploaderRef"
      v-model:file-list="uploader.list"
      :auto-upload="false"
    >
      <el-icon class="upload-icon">
        <Plus />
      </el-icon>
      <div class="upload-tip">点击上传</div>
      <template #file="{ file }">
        <div class="progress" v-if="file.status != 'ready'">
          <el-icon v-if="file.status == 'uploading'" class="refresh-icon"><Loading /></el-icon>
          <el-icon v-if="file.status == 'success'"><SuccessFilled /></el-icon>
          <el-icon v-if="file.status == 'fail'" class="close" @click.stop="onDelete(file)"
            ><CircleCloseFilled
          /></el-icon>
        </div>

        <!-- 图片 -->
        <el-image
          v-if="isImage(file)"
          :src="file.url"
          fit="contain"
          class="el-upload-list__item-thumbnail"
        >
          <template #error>
            <div class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </template>
        </el-image>
        <!-- 其余 -->
        <type-icon v-if="!isImage(file)" :name="fileType(file)"></type-icon>

        <!-- 操作 预览|裁剪|删除 -->
        <span class="el-upload-list__item-actions">
          <template v-if="isImage(file)">
            <el-icon @click.stop="onPreview(file)">
              <ZoomIn />
            </el-icon>
            <el-icon @click.stop="onCropper(file)">
              <Scissor />
            </el-icon>
          </template>
          <el-icon class="file-delete" @click.stop="onDelete(file)">
            <Delete />
          </el-icon>
        </span>
      </template>
    </el-upload>
  </el-main>
  <el-footer class="sa-flex sa-row-right">
    <el-button @click="onEmpty">清空</el-button>
    <el-button v-auth="'file.admin.file.upload'" @click="onUploadAll" type="primary"
      >全部上传</el-button
    >
  </el-footer>
  <el-image-viewer v-if="preview.show" @close="preview.show = false" :url-list="preview.list" />
</template>

<script>
  export default {
    name: 'FileUpload',
  };
</script>

<script setup>
  import { reactive, ref, unref } from 'vue';
  import fileApi from '../api';
  import { useModal } from '@/spring/hooks';
  import { checkUrl } from '@/spring/utils/checkUrlSuffix';
  import TypeIcon from './type-icon.vue';
  import FileCropper from './file-cropper.vue';
  import { cloneDeep } from 'lodash';

  const emit = defineEmits(['onChangeAction']);
  const props = defineProps(['group', 'savelog']);
  const uploaderRef = ref(null);

  const uploader = reactive({
    list: [],
  });

  function fileType(file) {
    return file.name.substring(file.name.lastIndexOf('.') + 1);
  }

  function isImage(file) {
    let image = ['jpg', 'jpeg', 'png', 'gif'];
    return image.includes(fileType(file));
  }

  // 删除
  function onDelete(file) {
    unref(uploaderRef).handleRemove(file);
  }
  // 清空
  function onEmpty() {
    unref(uploaderRef).clearFiles();
  }

  // 全部上传
  async function onUploadAll() {
    const list = cloneDeep(uploader.list);
    // 判断超过9张图片排队上传,小于9张并发上传
    if (list.length > 9) {
      for (let i = 0; i < list.length; i++) {
        await uploadSingleFile(list[i], i);
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        uploadSingleFile(list[i], i);
      }
    }
  }
  // 单个上传
  async function uploadSingleFile(file) {
    const elFile = uploader.list.find((item) => item.uid == file.uid);

    elFile.status = 'uploading';
    var formData = new FormData();
    formData.append('file', file.raw);
    let { error, data } = await fileApi.upload(
      { group: props.group, savelog: props.savelog },
      formData,
    );

    if (error == 0) {
      elFile.status = 'success';
      elFile.url = data.fullurl;
      setTimeout(() => {
        onDelete(elFile);
        if (uploader.list.length == 0) {
          emit('onChangeAction', 'select');
        }
      }, 500);
    } else {
      elFile.status = 'fail';
    }
  }

  // 索引
  function getFileIndex(file) {
    return uploader.list.findIndex((item) => item.uid == file.uid);
  }

  // 图片裁剪
  function onCropper(file) {
    useModal(
      FileCropper,
      {
        title: '图片剪裁',
        type: 'upload',
        cropper: file,
      },
      {
        confirm: async (res) => {
          uploader.list[getFileIndex(file)] = res.data;
        },
      },
    );
  }

  // 预览
  const preview = reactive({
    show: false,
    list: [],
  });
  function onPreview(file) {
    preview.list.push(file.url);
    preview.show = true;
  }
</script>
<style lang="scss" scoped>
  .file-upload {
    :deep() {
      .el-upload--picture-card {
        --el-upload-picture-card-size: 80px;
        .el-upload-dragger {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border: none;
          padding: 0;
        }
      }
      .el-upload-list__item {
        width: 80px;
        height: 80px;
      }
    }
    .el-upload-list__item-actions {
      .el-icon {
        font-size: 16px;
        margin-right: 8px;
        cursor: pointer;
        &:last-of-type {
          margin-right: 0;
        }
      }
      .file-delete:hover {
        color: #ff4d4f;
      }
    }
    .upload-icon {
      font-size: 16px;
      margin: 0 0 6px;
    }
    .upload-tip {
      font-size: 12px;
      color: var(--sa-subfont);
    }

    .progress {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10;
      background: rgba(38, 38, 38, 0.7);
      color: #52c41a;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .close {
      color: #ff4d4f;
      cursor: pointer;
    }
    .refresh-icon {
      color: var(--sa-background-assist);
      -webkit-animation: rotating 1s linear infinite;
      animation: rotating 1s linear infinite;
    }
  }
  .el-footer {
    border-top: 1px solid var(--sa-border);
  }
</style>
