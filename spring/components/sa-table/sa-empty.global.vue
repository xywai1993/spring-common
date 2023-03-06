<template>
  <div class="sa-empty sa-flex sa-row-center">
    <sa-svg :name="name" :size="size"></sa-svg>
  </div>
</template>

<script>
  /**
   * SaEmpty -没有数据 空白显示
   * @property {String} src - 图标名称
   * @property {String} src - 图标大小
   */
  export default {
    name: 'SaEmpty',
    props: {
      name: {
        type: String,
        default: 'sa-kongkongruye',
      },
      size: {
        type: [String || Number],
        default: '100',
      },
    },
  };
</script>

<style lang="scss" scoped>
  .sa-empty {
    width: 100%;
    padding: 50px 0;
  }
</style>
