<template>
  <div class="sa-preview sa-flex">
    <template v-for="(ul, uindex) in urlList" :key="ul">
      <el-image
        :class="border ? 'sa-image-border' : ''"
        :src="checkUrl(ul, { width: 100, height: 100 })"
        :preview-src-list="urlList"
        :initial-index="currentIndex"
        :style="{
          width: size + 'px',
          height: size + 'px',
          'border-radius': radius + 'px',
        }"
        fit="scale-down"
        @click="currentIndex = uindex"
        :preview-teleported="true"
      >
        <template #error>
          <div class="image-slot">
            <sa-svg name="sa-image"></sa-svg>
          </div>
        </template>
      </el-image>
    </template>
  </div>
</template>

<script>
export default {
  name: "SaPreview",
};
</script>
<script setup>
import { computed, ref } from "vue";
import { checkUrl } from "../../utils/checkUrlSuffix";
import { isString, isEmpty } from "lodash";
const props = defineProps({
  size: {
    type: [Number, String],
  },
  url: {
    type: [Array, String],
  },
  radius: {
    type: [Number, String],
    default: 4,
  },
  border: {
    type: Boolean,
    default: false,
  },
});

const currentIndex = ref(0);
function handleUrl() {
  if (isEmpty(props.url)) {
    return [];
  } else {
    let arr = props.url;
    if (isString(props.url)) {
      arr = arr.split(",");
    }
    return arr.map((u) => {
      return checkUrl(u);
    });
  }
}
const urlList = computed(() => handleUrl());
</script>

<style lang="scss" scoped>
.sa-preview {
  .el-image {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-right: 4px;
    &:last-of-type {
      margin-right: 0;
    }
  }
}
.sa-image-border {
  border: 1px solid var(--sa-border);
}
</style>
