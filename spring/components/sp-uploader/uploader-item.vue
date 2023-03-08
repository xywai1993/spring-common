<template>
  <sa-draggable
    v-if="urlList.length > 0"
    class="sa-flex sa-flex-wrap"
    v-model="urlList"
    item-key="element"
    :animation="300"
    handle=".sortable-drag"
    @end="emit('action', urlList)"
  >
    <template #item="{ element, index }">
      <div
        class="uploader-item sa-flex"
        :style="{
          width: size + 'px',
          height: size + 'px',
          margin: !multiple ? '0' : '',
        }"
      >
        <template v-if="element.includes('.')">
          <el-image
            :src="checkUrl(element, { width: 100, height: 100 })"
            fit="scale-down"
            :preview-src-list="[checkUrl(element)]"
            :preview-teleported="true"
          >
            <template #error>
              <div class="image-slot">
                <sa-svg name="sa-image"></sa-svg>
              </div>
            </template>
          </el-image>
        </template>
        <template v-else>
          <sa-icon :icon="element" size="32" />
        </template>
        <div class="card-mask">
          <el-icon v-if="multiple" class="sortable-drag"><Rank /></el-icon>
          <!-- <el-icon
              v-if="fileType == 'image' && element.includes('.')"
              @click.stop="previewViewer(ul)"
            >
              <ZoomIn />
            </el-icon> -->
          <el-icon @click.stop="removeFile(index)">
            <Delete />
          </el-icon>
        </div>
      </div>
    </template>
  </sa-draggable>

  <!-- <el-image-viewer v-if="previewVisible" @close="previewVisible = false" :url-list="[previewUrl]" :teleported="true" /> -->
</template>

<script>
export default {
  name: "UploaderItem",
};
</script>

<script setup>
import { ref, watch } from "vue";
import { checkUrl } from "../../utils/checkUrlSuffix";
import SaDraggable from "vuedraggable";

const emit = defineEmits(["action"]);
const props = defineProps(["urlList", "multiple", "fileType", "size"]);

const urlList = ref(props.urlList || []);
watch(
  () => props.urlList,
  () => {
    urlList.value = props.urlList;
  }
);

const previewVisible = ref(false);
const previewUrl = ref(null);
function previewViewer(url) {
  previewUrl.value = checkUrl(url, 50);
  previewVisible.value = true;
}

function removeFile(index) {
  urlList.value.splice(index, 1);
  emit("action", urlList.value);
}
</script>

<style lang="scss" scoped>
.uploader-item {
  width: 56px;
  height: 56px;
  border: 1px solid var(--sa-border);
  border-radius: 4px;
  margin: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  .card-mask {
    position: absolute;
    // top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    height: 20px;
    color: var(--sa-basic-mask-color);
    background: var(--sa-basic-mask-background);
    display: flex;
    align-items: center;
    justify-content: space-around;
    display: none;
    .el-icon {
      font-size: 12px;
      cursor: pointer;
    }
  }
  &:hover {
    .card-mask {
      display: flex;
    }
  }
  .el-image {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>
