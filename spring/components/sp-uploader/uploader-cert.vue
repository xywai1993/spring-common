<template>
  <div class="uploader-cert">
    <el-input v-model="inputUrl" :placeholder="placeholder" disabled>
      <template #append>
        <el-upload action :http-request="uploadFile" :show-file-list="false" accept=".pem, .crt">
          <el-button type="primary">上传证书</el-button>
        </el-upload>
      </template>
    </el-input>
  </div>
</template>
<script>
  export default {
    name: 'UploaderCert',
  };
</script>
<script setup>
  import fileApi from '../sa-file/api';
  import { ref, watch } from 'vue';

  const emit = defineEmits(['success']);
  const props = defineProps(['url', 'placeholder']);

  const inputUrl = ref(props.url);
  watch(
    () => props.url,
    () => {
      inputUrl.value = props.url;
    },
  );

  async function uploadFile(file) {
    let formData = new FormData();
    formData.append('file', file.file);
    const { error, data } = await fileApi.uploadCert(formData);
    if (error == 0) {
      emit('success', data.path);
    }
  }
</script>
