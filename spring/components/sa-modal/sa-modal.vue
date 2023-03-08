<template>
  <el-dialog
    v-for="(modal, index) in list"
    :key="modal.id"
    v-model="modal.show"
    :close-on-click-modal="false"
    :show-close="false"
    :fullscreen="modal.fullscreen"
    :class="
      modal.params.class ? modal.params.class + ' sa-dialog' : 'sa-dialog'
    "
    :draggable="true"
    :modal="modal.params.hasOwnProperty('modal') ? modal.params.modal : true"
  >
    <!-- header -->
    <template #header>
      <div class="title">
        <span>
          {{ modal.params.title }}
        </span>
      </div>
      <div class="tools-wrap sa-flex">
        <!--        <div class="sa-flex sa-row-center sa-m-l-8" @click="minimize(index)">-->
        <!--          <sa-svg name="sa-zoomout" size="16"></sa-svg>-->
        <!--        </div>-->
        <div
          v-if="!isMobile()"
          class="sa-flex sa-row-center sa-m-l-8"
          @click="fullscreen(index)"
        >
          <sa-svg name="sa-zoomin" size="16"></sa-svg>
        </div>
        <div class="sa-flex sa-row-center sa-m-l-8" @click="close(index)">
          <sa-svg name="sa-close" size="16"></sa-svg>
        </div>
      </div>
    </template>
    <component
      :is="modal.component"
      :modal="modal"
      @modalCallBack="modalCallBack(index, $event)"
    />
  </el-dialog>
  <!--  <div class="minimize-wrap sa-flex">-->
  <!--    <template v-for="(i, index) in list" :key="i.id">-->
  <!--      <div class="minimize-button sa-flex sa-row-center" v-if="i.minimize">-->
  <!--        <span class="minimize-button-tip sa-flex sa-row-center">-->
  <!--          <div class="sa-table-line-1" @click.stop="minimize(index)">-->
  <!--            {{ i.params.title }}-->
  <!--          </div>-->
  <!--          <sa-svg class="close sa-m-l-4" name="sa-close" size="12" @click="close(index)"></sa-svg>-->
  <!--        </span>-->
  <!--      </div>-->
  <!--    </template>-->
  <!--  </div>-->
</template>

<script>
import { isString } from "lodash";
import { buildShortUUID } from "../../utils";
// 全局页面弹框
export default {
  name: "SaModal",
};

let list = [];

export const useModal = async (component, params, callback = {}) => {
  if (isString(component) && component.includes(".")) {
    component = await getComponent(component);
  }
  component = markRaw(component);

  let modal = {
    id: buildShortUUID("modal"),
    component: component,
    params,
    show: true,
    fullscreen: false,
    minimize: false,
    callback,
  };
  list.push(modal);
  return modal;
};

async function getComponent(page) {
  page = page.split(".");
  let path = "/src/app";
  page.forEach((p, k) => {
    if (k + 1 == page.length) {
      path += "/" + p + ".vue";
    } else {
      path += "/" + p;
    }
  });
  let component = await import(/* @vite-ignore */ path);
  return component.default;
}
</script>

<script setup>
import { reactive, markRaw } from "vue";
import { buildShortUUID, isMobile } from "../../utils";

list = reactive([]);

// 全屏/还原
function fullscreen(index) {
  let modal = list[index];
  modal.fullscreen = !modal.fullscreen;
  if (modal.callback.fullscreen) {
    modal.callback.fullscreen();
  }
}

// 最小化/还原
function minimize(index) {
  let modal = list[index];
  modal.show = modal.minimize;
  modal.minimize = !modal.minimize;
  if (modal.callback.minimize) {
    modal.callback.minimize();
  }
}

// 关闭
function close(index = 0) {
  let modal = list[index];
  if (modal.callback.close) {
    modal.callback.close();
  }
  list.splice(index, 1);
}

// 模态框数据回调
function modalCallBack(index, data) {
  let modal = list[index];
  if (modal.callback[data.event]) {
    modal.callback[data.event](data);
  }
  close(index);
}
</script>
<style lang="scss">
@media only screen and (max-width: 768px) {
  .sa-dialog {
    .full-button {
      display: none;
    }
  }
}
.minimize-wrap {
  position: absolute;
  bottom: 0;
  left: 126px;
  width: calc(100% - 240px);
  height: 30px;
  z-index: 10;
  overflow: hidden;
  .minimize-button {
    position: relative;
    margin-right: 12px;
    &:last-of-type {
      margin-right: 0;
    }
    &::before {
      pointer-events: none;
      content: "";
      width: 0;
      height: 3px;
      background: var(--el-color-primary);
      border-radius: 2px;
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -12px;
      transition: all 0.2s ease-in-out;
    }
    .close {
      display: none;
    }
    &:hover {
      &::before {
        width: 24px;
      }
      .close {
        display: block;
      }
    }
    .minimize-button-tip {
      width: fit-content;
      height: 24px;
      padding: 0 8px 0 0;
      border-radius: 4px;
      color: var(--sa-footer-color);
      font-size: 14px;
      overflow: hidden;
      cursor: pointer;
      .sa-table-line-1 {
        height: 24px;
        line-height: 24px;
      }
    }
  }
  @keyframes drive {
    from {
      width: 8px;
    }
    to {
      width: 100px;
    }
  }
}

/* ==================
    el-col: 布局分栏
 ==================== */
@media only screen and (min-width: 992px) {
  .sa-dialog:not(.is-fullscreen) {
    @for $i from 0 through 24 {
      .sa-col-#{$i} {
        max-width: calc(calc($i * 100%) / 24) !important;
        flex: 0 0 calc(calc($i * 100%) / 24) !important;
      }
    }
  }
}
</style>
