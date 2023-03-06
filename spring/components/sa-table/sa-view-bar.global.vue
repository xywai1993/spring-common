<template>
  <el-footer class="sa-view-bar">
    <div class="left">
      <!-- 只能有一个父元素 -->
      <slot name="left"></slot>
    </div>
    <div class="right">
      <!-- 只能有一个父元素 -->
      <slot name="right"></slot>
    </div>
  </el-footer>
</template>
<script>
  export default {
    name: 'SaViewBar',
  };
</script>
<style lang="scss" scoped>
  .sa-view-bar {
    --sa-padding: 16px;
    height: auto !important;
    padding: 12px var(--sa-padding) 0 !important;
    background: var(--sa-background-assist);
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    position: relative;
    z-index: 10;
    .left,
    .right {
      :deep() {
        & > div {
          margin: 0 0 12px;
        }
      }
    }
  }
</style>
