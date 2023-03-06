<template>
  <div class="search-condition sa-flex sa-flex-wrap">
    <template v-for="(tas, key) in items" :key="tas">
      <div v-if="tas.type !== 'additional'" class="item sa-flex" @click="deleteItem(key)">
        <span v-if="tas.type === 'multiInput'">{{ tas.label }}:{{ multiText(tas.value) }}</span>
        <span v-else>{{ tas.label }}:{{ tas.value }}</span>
        <el-icon class="sa-m-l-6">
          <Close />
        </el-icon>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'SearchCondition',
  };
</script>
<script lang="ts" setup>
  import { FormToolDataType, formToolTransition } from './useCommonSearch';
  import { watch, ref } from 'vue';

  const emit = defineEmits<{
    (e: 'deleteFilter');
    (e: 'update:condition', d: FormToolDataType[]);
  }>();
  const props = defineProps<{
    condition: FormToolDataType[];
  }>();

  const items = ref<FormToolDataType[]>([]);

  watch(
    () => props.condition,
    () => {
      items.value = props.condition;
    },
    { immediate: true },
  );

  function deleteItem(key) {
    items.value.splice(key, 1);
    const { searchItem } = formToolTransition(items.value);
    emit('update:condition', searchItem);
    emit('deleteFilter');
  }

  const multiText = (value: string) => {
    return value.length > 20 ? value.slice(0, 20) + '...' : value;
  };
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
