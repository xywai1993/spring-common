<template>
  <div class="admin-menu">
    <div class="title">{{ !appStore.layout.collapse ? appStore.info.site_name : '' }}</div>
    <el-scrollbar style="height: auto">
      <el-menu
        :default-active="route.name"
        @select="toView"
        :collapse="appStore.layout.collapse"
        :style="{ width: appStore.layout.collapse ? '56px' : '190px' }"
      >
        <template v-for="item in menus" :key="item.name">
          <loop-menu :menuItem="item" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useApp } from '@/spring/hooks';
  import LoopMenu from './loop-menu.vue';
  import { useAccountStore } from '@/spring/store/account';
  import { useAppStore } from '@/spring/store/app';
  import { computed } from 'vue';
  const appStore = useAppStore();
  const router = useRouter();
  const route = useRoute();

  const { appBrowser } = useApp();
  const accountStore = useAccountStore();
  const menus = computed(() => accountStore.menus);
  const d_menus = computed(() => accountStore.d_menus);

  // 页面跳转
  function toView(name) {
    if (name !== route.name) {
      router.push({ name: name });
      appStore.menuCollapse(appBrowser.value.isMini);
    }
  }
</script>

<style lang="scss" scoped>
  .admin-menu {
    height: 100%;
    padding: 0 0 0 12px;
    background: var(--sa-background-assist);
    border-right: 1px solid var(--sa-border);
    overflow-y: scroll;
    .title {
      line-height: 64px;
      height: 64px;
      padding: 0 12px;
      font-size: 20px;
      font-weight: 500;
      color: var(--sa-subtitle);
    }
    .el-menu {
      --el-menu-active-color: var(--el-color-primary);
      --el-menu-text-color: var(--sa-font);
      --el-menu-hover-text-color: var(--el-color-primary);
      --el-menu-bg-color: transparent; //
      --el-menu-hover-bg-color: var(--el-color-primary-light-9);
      --el-menu-item-height: 40px; //
      --el-menu-sub-item-height: 40px; //
      --el-menu-horizontal-sub-item-height: 36px;
      --el-menu-item-font-size: var(--el-font-size-base);
      --el-menu-item-hover-fill: var(--el-color-primary-light-9);
      --el-menu-border-color: var(--el-border-color);
      --el-menu-base-level-padding: 12px; //
      --el-menu-level-padding: 20px;
      --el-menu-icon-width: 24px;
      --el-menu-icon-transform-closed: none;
      --el-menu-icon-transform-open: rotateZ(180deg);
      width: 190px;
      height: 100%;
      border-right: none;
      :deep() {
        .el-sub-menu__title,
        .el-menu-item {
          border-radius: 4px;
          &.is-active {
            background: var(--t-bg-hover);
          }
        }
        .el-sub-menu .el-menu-item {
          min-width: unset;
        }
      }
    }
  }
</style>
