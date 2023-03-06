<template>
  <el-pagination
    class="sa-pagination"
    :small="small"
    v-model:currentPage="pageData.page"
    v-model:page-size="pageData.page_size"
    :page-sizes="[10, 50, 100, 1000]"
    :layout="layout"
    :pager-count="5"
    :total="pageData.total"
    @size-change="changeSize"
    @current-change="changeCurrent"
  />
</template>
<script>
  export default {
    name: 'SaPagination',
  };
</script>
<script setup>
  const emit = defineEmits(['updateFn']);
  const props = defineProps({
    pageData: {
      type: Object,
    },
    small: {
      type: Boolean,
      default: false,
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
  });

  function changeSize(list_rows) {
    // props.pageData.list_rows = list_rows;
    emit('updateFn');
  }
  function changeCurrent(page) {
    // props.pageData.page = page;
    emit('updateFn');
  }
</script>

<style lang="scss" scoped>
  .sa-pagination {
    padding: 0;
    @media only screen and (max-width: 768px) {
      &.el-pagination {
        :deep() {
          .el-pagination__jump {
            display: none !important;
          }
          .el-pagination__sizes {
            display: none !important;
          }
          .el-pager {
            li {
              display: none;
              &.is-active {
                display: flex;
              }
            }
          }
        }
      }
    }
  }
</style>
