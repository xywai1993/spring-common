<template>
  <el-menu-item :index="menuItem.name">
    <sa-icon class="sa-m-r-8" size="16" :icon="menuItem.meta.icon" />
    <template #title>
      <span>{{ setting.multiLanguage ? $t(menuItem.meta.title) : menuItem.meta.title }}</span>
    </template>
  </el-menu-item>
</template>
<script lang="ts" setup>
  import { setting } from '@/spring/config';
  const props = defineProps(['menuItem']);
</script>
