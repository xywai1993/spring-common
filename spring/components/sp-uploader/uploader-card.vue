<template>
  <div class="uploader-card sa-flex sa-flex-wrap">
    <uploader-item
      :urlList="urlList.data"
      :multiple="multiple"
      :fileType="fileType"
      :size="size"
      @action="onUpdate"
    ></uploader-item>
    <uploader-action
      :urlList="urlList.data"
      :action="action"
      :savelog="savelog"
      :multiple="multiple"
      :max="max"
      :fileType="fileType"
      :size="size"
      @action="onUpdate"
    >
    </uploader-action>
  </div>
</template>

<script>
  export default {
    name: 'UploaderCard',
  };
</script>

<script setup>
  import { computed, reactive } from 'vue';
  import { isEmpty, isArray } from 'lodash';
  import UploaderItem from './uploader-item.vue';
  import UploaderAction from './uploader-action.vue';

  const emit = defineEmits(['success']);
  const props = defineProps([
    'url',
    'action',
    'savelog',
    'group',
    'fileType',
    'multiple',
    'max',
    'size',
  ]);

  const urlList = reactive({
    data: computed(() =>
      !isEmpty(props.url) ? (isArray(props.url) ? props.url : props.url.split(',')) : [],
    ),
  });

  function onUpdate(urlList) {
    emit('success', props.multiple ? urlList : urlList.length > 0 ? urlList[0] : '');
  }
</script>
