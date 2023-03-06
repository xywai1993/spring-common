<template>
  <el-container>
    <el-main>
      <el-scrollbar>
        <div class="group-item sa-flex sa-row-between" v-for="gl in group.list" :key="gl">
          <div class="sa-flex">
            <img src="/static/images/filemanager/group.png" />
            <span class="sa-m-l-12">{{ gl.name }}</span>
          </div>
          <el-radio v-model="group.selected" :label="gl.group"></el-radio>
        </div>
      </el-scrollbar>
    </el-main>
    <el-footer class="sa-footer--submit">
      <el-button @click="callback" type="primary" :disabled="!group.selected">移到此处</el-button>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'MoveGroup',
  };
</script>

<script setup>
  import { onMounted, reactive } from 'vue';
  import fileApi from '../api';

  const emit = defineEmits(['modalCallBack']);

  const group = reactive({ list: [], selected: '' });
  async function getGroup() {
    const { data } = await fileApi.group.list();
    group.list = data;
  }

  function callback() {
    emit('modalCallBack', { event: 'confirm', data: group.selected });
  }

  onMounted(() => {
    getGroup();
  });
</script>

<style lang="scss">
  .sa-dialog {
    &.filemanager-group-dialog {
      --el-dialog-width: 400px;
      .el-main {
        --el-main-padding: 0;
      }
      .el-radio__label {
        display: none;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .group-item {
    height: 48px;
    padding: 0 24px;
    border-bottom: 1px solid var(--sa-space);
    font-size: 14px;
    color: var(--sa-font);
    img {
      width: 20px;
      height: 20px;
    }
  }
</style>
