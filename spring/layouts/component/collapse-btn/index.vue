<template>
  <div
    class="open-icon pl-2"
    :class="appStore.layout.collapse ? 'fold' : 'open'"
    @click="onChangeCollapse"
  >
    <sa-icon icon="sa-first_page" size="16" />
  </div>
</template>

<script setup>
import { useAppStore } from "../../../store/app";

const appStore = useAppStore();
function onChangeCollapse() {
  appStore.menuCollapse(!appStore.layout.collapse);
}
</script>

<style lang="scss" scoped>
.open-icon {
  cursor: pointer;
  height: 48px;
  display: flex;
  align-items: center;
  &.fold > .sa-icon {
    transform: rotateZ(180deg);
    transition: transform 0.25s linear;
  }
  &.open > .sa-icon {
    transform: rotateZ(0deg);
    transition: transform 0.25s linear;
  }
}
</style>
