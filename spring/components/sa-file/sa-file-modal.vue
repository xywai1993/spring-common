<template>
  <el-dialog
    class="sa-dialog sa-file"
    v-model="modal.show"
    :close-on-click-modal="false"
    :show-close="false"
    :fullscreen="modal.fullscreen"
    :draggable="true"
    :destroy-on-close="true"
  >
    <!-- header -->
    <template #header>
      <div class="title">
        <span>选择图片</span>
      </div>
      <div class="tools-wrap sa-flex">
        <div class="sa-flex sa-row-center sa-m-l-8" @click="fullscreen(index)">
          <sa-svg name="sa-zoomin" size="16"></sa-svg>
        </div>
        <div class="sa-flex sa-row-center sa-m-l-8" @click="close(index)">
          <sa-svg name="sa-close" size="16"></sa-svg>
        </div>
      </div>
    </template>
    <sa-filemanager :params="modal.params" @callback="callback" />
  </el-dialog>
</template>

<script>
  import SaFilemanager from './sa-filemanager.vue';
  export default {
    name: 'SaFileModal',
  };

  let modal = {
    show: false,
    fullscreen: false,
    params: {
      type: 'select',
      fileType: 'all',
    },
    callback: {},
  };

  function useFile(params, callback = {}) {
    modal.show = true;
    modal.params = { ...modal.params, ...params };
    modal.callback = callback;
    return useFile;
  }

  export { useFile };
</script>
<script setup>
  import { reactive } from 'vue';

  modal = reactive(modal);

  function fullscreen() {
    modal.fullscreen = !modal.fullscreen;
  }
  function close() {
    modal.show = false;
    modal.callback.close?.();
  }
  function callback(data) {
    modal.show = false;
    modal.callback[data.event]?.(data?.data);
  }
</script>
