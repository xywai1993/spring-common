<template>
  <el-drawer
    class="sa-drawer sa-filter-drawer"
    v-model="modal.show"
    title="筛选"
    direction="rtl"
    :before-close="handleClose"
    :size="432"
    :destroy-on-close="true"
  >
    <template #header>
      <div class="title">
        <span>筛选</span>
      </div>
    </template>
    <component :is="modal.componentId" :filterParams="modal.params" @filterBack="filterBack" />
  </el-drawer>
</template>

<script lang="ts" setup>
  import { markRaw, reactive } from 'vue';
  import { modal, cb } from './useDrawer';

  function handleClose() {
    modal.show = false;
    cb.close?.();
  }

  function filterBack(data) {
    modal.show = false;
    cb[data.event]?.(data?.data);
  }
</script>
<style lang="scss">
  .sa-filter-drawer {
    .el-drawer__header {
      height: 56px;
      line-height: 56px;
      margin: 0;
      padding: 0 var(--sa-padding);
      border-bottom: 1px solid var(--sa-border);
    }

    .title {
      font-size: 16px;
      color: var(--sa-title);

      span {
        width: fit-content;
        line-height: 1;
        padding: 0 2px;
        position: relative;
        z-index: 2;

        &:after {
          pointer-events: none;
          content: '';
          position: absolute;
          height: 8px;
          background: var(--t-bg-active);
          bottom: 0;
          right: 0;
          left: 0;
          z-index: -1;
        }
      }
    }

    .el-drawer__body {
      padding: 0 !important;
      display: flex;
      width: 100%;

      & > div {
        height: 100%;
        display: flex;
      }
      .el-input,
      .el-select,
      .el-cascader,
      .el-textarea {
        width: 100%;
        max-width: unset;
      }
    }
  }
</style>
