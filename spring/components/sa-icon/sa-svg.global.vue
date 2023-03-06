<template>
  <svg :class="[$attrs.class, 'sa-icon']" :style="getStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script>
  export default {
    name: 'SaSvg',
  };
</script>
<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [Number, String],
      default: 12,
    },
  });

  const symbolId = computed(() => `#${props.name}`);

  const getStyle = computed(() => {
    const { size } = props;
    let s = `${size}`;
    s = `${s.replace('px', '')}px`;
    return {
      width: s,
      height: s,
    };
  });
</script>
<style lang="scss" scoped>
  svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    stroke: currentColor;
    vertical-align: middle;
    overflow: hidden;
    color: inherit;
    &:focus {
      outline: none;
    }
  }
</style>
