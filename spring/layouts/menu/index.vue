<template>
  <div class="sa-flex">
    <!--    <div class="app-menu">-->
    <!--      <div class="logo">-->
    <!--        <sa-image :url="appInfo.logo" size="40" fit="contain"></sa-image>-->
    <!--      </div>-->
    <!--      <div class="line sa-m-t-10 sa-m-b-10"></div>-->
    <!--      <el-scrollbar>-->
    <!--        <el-menu :default-active="appName" :collapse="true" @select="changeApp">-->
    <!--          <template v-for="item in appMenu2" :key="item.name">-->
    <!--            <el-menu-item :index="item.name">-->
    <!--              <el-tooltip-->
    <!--                effect="light"-->
    <!--                :content="item.title"-->
    <!--                placement="right"-->
    <!--                :offset="6"-->
    <!--                popper-class="el-menu-tooltip"-->
    <!--              >-->
    <!--                <div class="el-menu-tooltip__trigger">-->
    <!--                  <sa-icon :icon="item.icon" size="24" />-->
    <!--                </div>-->
    <!--              </el-tooltip>-->
    <!--            </el-menu-item>-->
    <!--          </template>-->
    <!--        </el-menu>-->
    <!--      </el-scrollbar>-->
    <!--    </div>-->
    <app-children-menu :menuStyle="menuStyle" />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useModal, useApp } from "../../hooks";
import AppChildrenMenu from "./style/index.vue";
import { useAccountStore } from "../../store/account";
// import shopRouters from '@/app/shop/routes/index';

const accountStore = useAccountStore();
const router = useRouter();
const route = useRoute();
const account = computed(() => accountStore.info);

const { appInfo, appMenu, appName, changeApp, appChildrenMenu, menuStyle } =
  useApp();
</script>
<style lang="scss" scoped>
.app-menu {
  width: 56px;
  height: 100%;
  padding: 10px 0 2px;
  background: var(--t-bg-app);
  display: flex;
  flex-direction: column;
  align-items: center;
  .line {
    width: 32px;
    height: 1px;
    background: var(--sa-background-assist);
    border-radius: 4px;
  }
  --el-menu-active-color: var(--el-color-primary);
  --el-menu-text-color: var(--el-text-color-primary);
  --el-menu-hover-text-color: var(--el-color-primary);
  --el-menu-bg-color: transparent; //
  --el-menu-hover-bg-color: transparent; //
  --el-menu-item-height: 40px; //
  --el-menu-sub-item-height: calc(var(--el-menu-item-height) - 6px);
  --el-menu-horizontal-sub-item-height: 36px;
  --el-menu-item-font-size: var(--el-font-size-base);
  --el-menu-item-hover-fill: var(--el-color-primary-light-9);
  --el-menu-border-color: var(--el-border-color);
  --el-menu-base-level-padding: 0; //
  --el-menu-level-padding: 12px;
  --el-menu-icon-width: 24px;
  --el-menu-icon-transform-closed: none;
  --el-menu-icon-transform-open: rotateZ(180deg);
  .el-menu {
    border-right: none;
    &--collapse {
      width: 56px;
    }
  }
  :deep() {
    .el-menu-item {
      width: 40px;
      height: 40px;
      padding: 0;
      margin: 0 8px 8px;
      position: relative;
      &::before {
        pointer-events: none;
        content: "";
        width: 3px;
        height: 0;
        background: var(--el-color-primary);
        border-radius: 0 3px 3px 0;
        position: absolute;
        top: 20px;
        left: -8px;
        transition: all 0.2s ease-in-out;
      }
      &:hover {
        &::before {
          height: 24px;
          top: 8px;
        }
        .el-menu-tooltip__trigger {
          border-radius: 12px;
        }
      }
      &.is-active {
        &::before {
          height: 40px;
          top: 0;
        }
        .el-menu-tooltip__trigger {
          border-radius: 12px;
          color: var(--sa-background-assist);
          background: var(--el-color-primary);
        }
      }
      .el-menu-tooltip__trigger {
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 20px;
        background: var(--sa-background-assist);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease-in-out;
        .sa-image {
          width: 40px !important;
          height: 40px !important;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.el-menu-tooltip {
  color: var(--sa-font);
  background: var(--sa-background-assist);
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.12));
  border: none !important;

  @media only screen and (max-width: 768px) {
    display: none !important;
  }
}
</style>
