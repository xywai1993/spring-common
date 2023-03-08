<template>
  <el-sub-menu :index="menuItem.name">
    <template #title>
      <div>
        <sa-icon
          style="vertical-align: -3px"
          class="sa-m-r-8"
          size="16"
          :icon="menuItem.meta.icon"
        />
      </div>
      <span>{{
        setting.multiLanguage ? $t(menuItem.meta.title) : menuItem.meta.title
      }}</span>
    </template>
    <slot />
  </el-sub-menu>
</template>
<script setup>
import { setting } from "../../../../config";

const props = defineProps(["menuItem"]);
</script>
