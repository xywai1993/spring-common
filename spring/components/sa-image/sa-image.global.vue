<template>
  <div
    class="sa-image sa-flex"
    :class="border ? 'sa-image-border' : ''"
    :style="{
      width: size + 'px',
      height: size + 'px',
      'border-radius': radius + 'px',
    }"
  >
    <el-image :src="checkUrl(url, suffix)" :fit="fit" referrerpolicy="no-referrer">
      <template #error>
        <div class="image-slot">
          <sa-svg name="sa-image"></sa-svg>
        </div>
      </template>
    </el-image>
  </div>
</template>

<script>
  /**
   * size: 30, 宽高
   * url: "https://dummyimage.com/100x100", // src 地址
   * radius: 0, // 图片圆角
   * border: false, // 是否有 border
   */
  import { checkUrl } from '@/spring/utils/checkUrlSuffix';
  export default {
    name: 'SaImage',
    emits: ['update:url'],
    props: {
      url: {
        type: String,
        default: '',
      },
      size: {
        type: [Number, String],
      },
      fit: {
        type: String,
        default: 'cover',
      },
      radius: {
        type: [Number, String],
        default: 4,
      },
      border: {
        type: Boolean,
        default: false,
      },
      preview: {
        type: Boolean,
        default: false,
      },
      remove: {
        type: Boolean,
        default: false,
      },
      suffix: {
        default: {
          width: 200,
          height: 200,
        },
      },
    },
    setup() {
      return { checkUrl };
    },
  };
</script>

<style lang="scss" scoped>
  .sa-image {
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    .el-image {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      .image-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      i {
        margin-right: 0 !important;
      }
    }
  }
  .sa-image-border {
    border: 1px solid var(--sa-border);
  }
</style>
