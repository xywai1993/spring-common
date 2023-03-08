<template>
  <div class="error-index panel-block sa-flex sa-row-center">
    <img src="/static/images/error/404.png" />
    <div>未找到页面</div>
  </div>
</template>
<script setup>
import { useAppStore } from "../../store/app";

const appStore = useAppStore();
// const currentPageIndex = appStore.taskbar.list.findIndex((e) => e.name == 'NotFoundPage');
// const close = () => {
//   closeTaskbar(currentPageIndex);
// };

// const second = ref(5);
// let secondTime = null;
// function startTime() {
//   secondTime = setInterval(() => {
//     second.value--;
//     if (second.value === 0) {
//       clearInterval(secondTime);
//     }
//   }, 1000);
// }
// startTime();
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
