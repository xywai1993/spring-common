<template>
  <menu-item :menuItem="menuItem" :level="level" />
  <slot :level="level + 1" />
</template>
<script setup>
  import MenuItem from './menu-item.vue';
  const props = defineProps(['menuItem', 'level']);
</script>
