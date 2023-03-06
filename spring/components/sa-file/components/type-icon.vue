<template>
  <div class="type-icon sa-flex sa-row-center">
    <img
      :src="`./static/images/filemanager/${
        typeList.hasOwnProperty(name) ? typeList[name] : 'weizhi'
      }.png`"
      size="60"
    />
  </div>
</template>

<script>
  export default {
    name: 'TypeIcon',
  };
</script>

<script setup>
  const props = defineProps(['name']);

  let typeList = {
    zip: 'zip',
    pdf: 'pdf',
    ppt: 'ppt',
    txt: 'txt',
    xls: 'xls',
    doc: 'doc',
    mov: 'video',
    mp4: 'video',
    avi: 'video',
  };
</script>
<style lang="scss" scoped>
  .type-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
