<template>
  <div class="search-condition sa-flex sa-flex-wrap">
    <template v-for="(tas, key) in conditionLabel" :key="tas">
      <div class="item sa-flex" @click="deleteItem(key)">
        <span>{{ tas }}</span>
        <el-icon class="sa-m-l-6">
          <Close />
        </el-icon>
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    name: 'SearchOldCondition',
  };
</script>
<script setup>
  const emit = defineEmits(['deleteFilter']);
  const props = defineProps(['conditionLabel']);

  function deleteItem(key) {
    emit('deleteFilter', key);
  }
</script>
<style lang="scss" scoped>
  .search-condition {
    margin-left: 24px;
    margin-bottom: -8px;
    .item {
      width: fit-content;
      line-height: 22px;
      height: 22px;
      border-radius: 4px;
      padding: 0 4px 0 8px;
      background: var(--sa-space);
      font-size: 12px;
      color: var(--sa-font);
      margin-right: 8px;
      margin-bottom: 8px;
      &:last-of-type {
        margin-right: 0;
      }
    }
    @media only screen and (max-width: 768px) {
      display: none;
    }
  }
</style>
