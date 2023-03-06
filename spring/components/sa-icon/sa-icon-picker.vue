<template>
  <el-container class="sa-icon-picker">
    <el-header class="sa-header">
      <el-tabs class="sa-tabs" v-model="tabName">
        <el-tab-pane label="ElementPlus" name="ep"></el-tab-pane>
        <el-tab-pane label="Ant Design" name="ant-design"></el-tab-pane>
        <el-tab-pane label="本地图标" name="svg"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-main>
      <el-input class="sa-m-b-16" v-model="search">
        <template #prepend>搜索图标</template>
      </el-input>
      <div>
        <div v-if="icons.length">
          <ul class="sa-flex sa-flex-wrap">
            <li
              v-for="icon in icons"
              :key="icon"
              :class="['icon-item', currentSelect == icon ? 'is-active' : '']"
              @click="onSelect(icon)"
              :title="icon"
            >
              <sa-svg v-if="tabName == 'svg'" :name="icon" size="16" />
              <sa-icon v-else :icon="icon" size="16" />
            </li>
          </ul>
        </div>
        <template v-else>
          <sa-empty />
        </template>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  export default {
    name: 'SaIconPicker',
  };
</script>
<script setup>
  import { computed, ref } from 'vue';

  import epIconsData from './data/ep';
  import antDesignIconsData from './data/ant-design';
  import svgIconsData from './data/svg';

  const emit = defineEmits(['modalCallBack']);

  const iconsData = {
    'ant-design': antDesignIconsData,
    ep: epIconsData,
    svg: svgIconsData,
  };

  const tabName = ref('ep');

  const search = ref('');

  function getIcons() {
    const data = iconsData[tabName.value];
    const prefix = data?.prefix ?? '';

    let result = [];
    if (tabName.value != 'svg') {
      result = data?.icons.map((item) => `${prefix}:${item}`);
    } else {
      result = data?.icons.map((item) => `${prefix}-${item}`);
    }

    if (search.value) {
      result = result.filter((item) => item.includes(search.value));
    }
    return result;
  }
  const icons = computed(() => getIcons());

  const currentSelect = ref('');

  function onSelect(icon) {
    currentSelect.value = icon;
    emit('modalCallBack', { event: 'confirm', data: icon });
  }
</script>

<style lang="scss" scoped>
  .sa-icon-picker {
    .sa-header {
      padding: 0 16px;
    }
    .icon-item {
      width: 40px;
      height: 40px;
      border: 1px solid var(--sa-border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 8px 8px 0;
      font-size: 20px;

      &.is-active {
        border-color: var(--el-color-primary);
      }
    }
  }
</style>
