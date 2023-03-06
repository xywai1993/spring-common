<template>
  <el-menu-item :index="menuItem.name" :style="itemStyle()">
    <sa-icon class="sa-m-r-8" size="16" :icon="menuItem.icon" />
    <template #title>
      <span class="sa-line-1">{{ menuItem.title }}</span>
    </template>
  </el-menu-item>
</template>
<script setup>
  const props = defineProps(['menuItem', 'level']);

  function itemStyle() {
    if (props.level) {
      return {
        height: '32px',
        'line-height': '32px',
        'padding-left': 16 + props.level * 8 + 'px',
        'font-size': '12px',
        color: 'var(--sa-font)',
      };
    }
  }
</script>
