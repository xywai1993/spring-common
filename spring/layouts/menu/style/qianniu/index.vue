<template>
  <div class="shop-menu">
    <el-scrollbar class="menu-1" height="100%">
      <div class="title">{{ currentApp.title }}</div>
      <el-menu :default-active="shop.name" @select="onSelect">
        <template v-for="menu in currentApp.children" :key="menu">
          <menu-item :menuItem="menu" />
        </template>
      </el-menu>
    </el-scrollbar>
    <el-scrollbar
      v-if="shop.childrenMenu.length > 0"
      class="menu-2"
      height="100%"
    >
      <el-menu :default-active="route.name" @select="toView">
        <template v-for="menu in shop.childrenMenu" :key="menu">
          <loop-menu :menuItem="menu" :level="0" />
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useApp, useModal } from "../../../../hooks";
import MenuItem from "./menu-item.vue";
import LoopMenu from "./loop-menu.vue";
import { isEmpty } from "lodash";
import { fromQuery } from "lodash-contrib";
import { useAppStore } from "../../../../store/app";

const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

const { appBrowser, currentApp, appChildrenMenu } = useApp();

const shop = reactive({
  name: "",
  childrenMenu: [],
});

function initShop(data, parent) {
  data.forEach((i) => {
    if (i.name == route.name) {
      if (isEmpty(parent)) {
        shop.name = i.name;
      } else {
        shop.name = parent.name;
        shop.childrenMenu = parent.children;
      }
    }
    if (!isEmpty(i.children)) {
      initShop(i.children, i);
    }
  });
}

function onSelect(name) {
  const menu = appChildrenMenu.value.find((m) => m.name == name);
  if (isEmpty(menu.children)) {
    shop.childrenMenu = [];
    toView(name);
  } else {
    shop.childrenMenu = menu.children;
  }
}

async function toView(name) {
  let item = {};
  loopType(appChildrenMenu.value);
  function loopType(data) {
    data.forEach((i) => {
      if (i.name == name) {
        item = i;
      }
      if (!isEmpty(i.children)) {
        loopType(i.children);
      }
    });
  }
  //todo-jj
  if (item.type == "modal") {
    let params = {
      title: item.title,
    };
    if (item.params) params = { ...params, ...fromQuery(item.params) };
    useModal(name, params);
  } else {
    if (name != route.name) {
      router.push({
        name: name,
        query: item.params ? fromQuery(item.params) : {},
      });
      appStore.menuCollapse(appBrowser.value.isMini);
    }
  }
}

onMounted(() => {
  initShop(appChildrenMenu.value, {});
});
</script>

<style lang="scss" scoped>
.shop-menu {
  --el-menu-active-color: var(--el-color-primary);
  --el-menu-text-color: var(--el-text-color-primary);
  --el-menu-hover-text-color: var(--el-color-primary);
  --el-menu-bg-color: transparent; //
  --el-menu-hover-bg-color: transparent; //
  --el-menu-item-height: 56px;
  --el-menu-sub-item-height: calc(var(--el-menu-item-height) - 6px);
  --el-menu-horizontal-sub-item-height: 36px;
  --el-menu-item-font-size: var(--el-font-size-base);
  --el-menu-item-hover-fill: var(--el-color-primary-light-9);
  --el-menu-border-color: var(--el-border-color);
  --el-menu-base-level-padding: 16px; //
  --el-menu-level-padding: 16px; //
  --el-menu-icon-width: 24px;
  --el-menu-icon-transform-closed: none;
  --el-menu-icon-transform-open: rotateZ(180deg);

  height: 100%;
  display: flex;
  background: var(--t-bg-color);
  .el-menu {
    border-right: none;
  }
  .title {
    line-height: 64px;
    padding: 0 12px;
    font-size: 20px;
    font-weight: 500;
    color: var(--sa-subtitle);
  }
  .menu-1 {
    --el-menu-item-height: 48px;
    --el-menu-text-color: #737182;

    width: 104px;
    padding: 0 0 0 8px;
    :deep() {
      .el-menu-item {
        .sa-icon {
          width: 16px;
          margin-right: 8px;
        }
        &:hover {
          color: var(--el-color-primary);
        }
        &.is-active {
          background: var(--sa-background-assist);
          border-radius: 16px 0 0 16px;
          box-shadow: -8px 0 8px rgba(205, 205, 205, 0.02);
          &::after {
            content: "";
            position: absolute;
            top: -12px;
            right: 0;
            width: 12px;
            height: 12px;
            background: radial-gradient(
              circle at 0% 0%,
              transparent 12px,
              var(--sa-background-assist) 0
            );
          }
          &::before {
            content: "";
            position: absolute;
            right: 0;
            bottom: -12px;
            width: 12px;
            height: 12px;
            background: radial-gradient(
              circle at 0 100%,
              transparent 12px,
              var(--sa-background-assist) 0
            );
          }
        }
      }
    }
  }
  .menu-2 {
    --el-menu-text-color: var(--sa-subtitle);
    --el-menu-item-height: 40px;

    width: 120px;
    padding: 12px 8px;
    background: var(--sa-background-assist);
    border-radius: 8px 0 0;
    border-right: 1px solid var(--sa-border);
    :deep() {
      .el-menu-item {
        border-radius: 8px;
        margin-bottom: 4px;
        &.is-active,
        &:hover {
          background: var(--t-bg-hover);
        }
      }
      .sa-icon {
        display: none !important;
      }
    }
  }
}
</style>
