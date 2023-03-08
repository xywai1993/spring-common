<template>
  <el-dialog
    v-for="(modal, index) in modalList"
    v-model="modal.show"
    :key="modal.id"
    :close-on-click-modal="false"
    :show-close="false"
    :fullscreen="modal.fullscreen"
    :class="['sa-dialog', modal?.dialog?.class]"
    :draggable="true"
    :modal="modal.dialog?.modal ? modal.dialog.modal : true"
  >
    <!-- header -->
    <template #header>
      <div class="title">
        <span>
          {{ checkTitle(modal) }}
        </span>
      </div>
      <div class="tools-wrap sa-flex">
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
      :params="modal.params"
      @modalCallBack="modalCallBack(index, $event)"
    />
  </el-dialog>
</template>

<script lang="ts">
// 新版全局页面通用弹框
export default {
  name: "SpGlobalModal",
};
</script>

<script lang="ts" setup>
import { reactive, markRaw, shallowRef, triggerRef } from "vue";
import { buildShortUUID, isMobile } from "../../utils";
import { modalList, ModalType } from "./main";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const checkTitle = (modal: ModalType) => {
  if (modal.dialog?.title) {
    return modal.dialog?.title;
  }

  if (modal.params?.id) {
    return t("edit");
  } else {
    return t("add");
  }
};

// 全屏/还原
function fullscreen(index) {
  const modal = modalList.value[index];
  modal.fullscreen = !modal.fullscreen;
  triggerRef(modalList);
  if (modal.callback.fullscreen) {
    modal.callback.fullscreen();
  }
}

// 关闭
function close(index) {
  const modal = modalList.value[index];
  modal.show = false;
  if (modal.dialog?.destroyModal !== false) {
    modal.component = null;
  }
  modalList.value.splice(index, 1);
  triggerRef(modalList);
}

// 模态框数据回调
function modalCallBack(index, data: { event: string; data: any }) {
  const modal = modalList.value[index];
  if (modal.callback[data.event]) {
    modal.callback[data.event]?.(data.data);
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
