<template>
  <!-- TODO: 菜单宽度事件更新 -->
  <QianniuMenu v-if="menuStyle === 'qianniu'" />
  <ElementMenu v-else />
</template>

<script setup>
  import ElementMenu from './element/index.vue';
  import QianniuMenu from './qianniu/index.vue';

  const props = defineProps({
    menuStyle: {
      type: String,
      default: 'element',
    },
  });
  const emits = defineEmits(['widthChange']);
</script>
