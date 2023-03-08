<template>
  <el-container>
    <el-main>
      <div class="filemanager-cropper">
        <img ref="cropperRef" :src="checkUrl(modal.params.cropper.url)" />
      </div>
    </el-main>
    <el-footer class="sa-footer--submit">
      <el-button @click="callback" type="primary">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "FileCropper",
};
</script>

<script setup>
import { nextTick, onMounted, ref, unref } from "vue";
import { checkUrl } from "../../../utils/checkUrlSuffix";
import Cropper from "cropperjs";
import { cloneDeep } from "lodash";

const emit = defineEmits(["modalCallBack"]);
const props = defineProps(["modal"]);

const cropperRef = ref(null);
const saCropper = ref(null);
async function callback() {
  if (props.modal.params.type == "select") {
    const files = dataURLtoFile(
      saCropper.value
        .getCroppedCanvas({
          imageSmoothingQuality: "high",
        })
        .toDataURL(props.modal.params.cropper.mimetype),
      props.modal.params.cropper.filename
    );
    emit("modalCallBack", { event: "confirm", data: files });
  }
  if (props.modal.params.type == "upload") {
    const upCropper = cloneDeep(props.modal.params.cropper);
    upCropper.url = saCropper.value
      .getCroppedCanvas({
        imageSmoothingQuality: "high",
      })
      .toDataURL(props.modal.params.cropper.raw.type);
    upCropper.raw = dataURLtoFile(
      upCropper.url,
      props.modal.params.cropper.name
    );
    upCropper.url = URL.createObjectURL(upCropper.raw);
    emit("modalCallBack", { event: "confirm", data: upCropper });
  }
}
// base64 转文件
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
onMounted(() => {
  nextTick(() => {
    const image = unref(cropperRef);
    saCropper.value = new Cropper(image, {
      viewMode: 1,
    });
  });
});
</script>

<style lang="scss">
.filemanager-cropper {
  width: auto;
  height: 300px;
  .cropper-container {
    width: auto;
    height: 300px;
  }
}
</style>
