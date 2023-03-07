<template>
  <div class="app-process">
    <v-contextmenu ref="cm">
      <v-contextmenu-item
        :disabled="taskbar.list.length < 2"
        @click="onClose(selectedCM)"
      >
        <el-icon><Close /></el-icon>
        关闭
      </v-contextmenu-item>
      <v-contextmenu-item
        :disabled="taskbar.list.length < 2"
        @click="closeOther(selectedCM)"
      >
        关闭其它
      </v-contextmenu-item>
      <v-contextmenu-divider />
      <v-contextmenu-item>
        <el-icon><SwitchButton /></el-icon>
        取消
      </v-contextmenu-item>
    </v-contextmenu>
    <!-- TODO: 页面需要开多个路由栈(传值) -->
    <div class="app-process__scroller sa-flex">
      <div
        v-for="(item, index) in taskbar.list"
        :key="index"
        class="app-process__item sa-flex"
        :class="{ active: item.name == taskbar.history[0] }"
        :data-index="index"
        @click="onMenu(item, Number(index))"
        v-contextmenu:cm
        @contextmenu.prevent.stop="onCM(e, item)"
      >
        <div v-if="!item.meta?.hideInTabs" class="wrap sa-flex">
          <sa-icon
            v-if="item.meta?.icon"
            class="sa-m-r-8"
            :icon="item.meta?.icon"
            size="14"
          />
          <span class="text">{{ $t(item.title) }} </span>
          <div
            v-if="taskbar.list.length > 1"
            class="item-close sa-flex sa-row-center"
          >
            <el-icon @click.stop="onClose(item.name)">
              <Close class="close" />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { directive } from "v-contextmenu";
export default {
  name: "taskbar",
  directives: {
    contextmenu: directive,
  },
};
</script>
<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { closeTaskbar, closeOtherTaskbar } from "../../hooks/useTaskbar";
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
const router = useRouter();
const selectedCM = ref(0);

// 任务栏列表
const taskbar = computed(() => appStore.taskbar);

// 点击菜单
function onMenu(item, index) {
  router.push({
    path: item.path,
    query: item.query,
  });
}

// 右键选项卡
function onCM(e, item) {
  selectedCM.value = item.name;
}

// 关闭
function onClose(name) {
  closeTaskbar(name);
}

// 关闭其他
function closeOther(name) {
  closeOtherTaskbar(name);
}
</script>

<style lang="scss" scoped>
.app-process {
  display: flex;
  align-items: center;
  height: 48px;
  position: relative;

  &__scroller {
    width: 100%;
    flex: 1;
    overflow: hidden;
    padding: 0 16px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    height: 48px;
    position: relative;
    min-width: 38px;
    transition: all 0.2s;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: -12px;
      height: 4px;
      border-radius: 2px;
      background: var(--t-btn-active);
    }
    &::after {
      content: "";
      position: absolute;
      top: 16px;
      left: 0;
      width: 1px;
      height: 16px;
      border-radius: 2px;
      background: var(--sa-border);
    }
    &:first-of-type {
      &::after {
        display: none;
      }
    }
    .wrap {
      min-width: 38px;
      height: 36px;
      padding: 0 12px;
      border-radius: 8px;
      font-size: 13px;
      color: var(--sa-font);
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .sa-icon {
      flex-shrink: 0;
    }

    .item-close {
      flex-shrink: 0;
      width: 0;
      height: 16px;
      overflow: hidden;
      transition: all 0.3s;
      .el-icon {
        font-size: 12px;
      }
      &:hover {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--t-bg-active);
        .close {
          color: var(--el-color-primary);
        }
      }
    }
    &:not(:hover),
    &:not(.active) {
      .text {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        height: 23px;
        line-height: 23px;
      }
    }

    &:hover {
      flex-shrink: 0;
      min-width: unset;
      .wrap {
        color: var(--el-color-primary);
        background: var(--t-bg-hover);
      }

      &::before {
        width: 24px;
      }
      .item-close {
        width: 16px;
        margin-left: 8px;
      }
      &:after {
        display: none;
      }
      & + .app-process__item {
        &:after {
          display: none;
        }
      }
    }
    &.active {
      flex-shrink: 0;
      min-width: unset;
      .wrap {
        color: var(--el-color-primary);
        background: var(--t-bg-hover);
      }
      &::before {
        width: 24px;
        background-color: var(--el-color-primary);
      }
      .item-close {
        width: 16px;
        margin-left: 8px;
      }
      &:after {
        display: none;
      }
      & + .app-process__item {
        &:after {
          display: none;
        }
      }
    }
  }
  @media only screen and (max-width: 768px) {
    display: none;
  }
}
</style>
