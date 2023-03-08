<template>
  <div class="error-index panel-block sa-flex sa-row-center">
    <img src="/static/images/error/403.png" />
    <div>
      未找到页面,
      <span>
        <span>{{ second }}</span> 秒后自动关闭
      </span>
      <span class="close" @click="close">上一页</span>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "../../store/app";

const appStore = useAppStore();

const taskbar = appStore.taskbar;
const route = useRoute();
const close = () => {
  appStore.closeTaskbar(currentPageIndex);
};

const second = ref(5);
const secondTime = ref();
function startTime() {
  secondTime.value = setInterval(() => {
    second.value--;
    if (second.value == 0) {
      clearInterval(secondTime.value);
      close();
    }
  }, 1000);
}
startTime();
</script>
<style lang="scss" scoped>
.error-index {
  flex-direction: column;
  color: var(--sa-font);
  font-size: 16px;
  img {
    width: 280px;
    height: 240px;
    margin: -40px 0 24px 0;
  }
  .close {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}
</style>
