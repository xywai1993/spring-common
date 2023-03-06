<template>
  <sa-svg v-if="isSvgIcon" :class="[$attrs.class]" :size="size" :name="icon" />
  <sa-image v-else-if="isImage" :class="['sa-icon', $attrs.class]" :size="size" :url="icon" />
  <span
    v-else
    ref="elRef"
    :class="[$attrs.class, 'sa-icon app-iconify']"
    :style="getWrapStyle"
  ></span>
</template>
<script>
  export default {
    name: 'SaIcon',
  };
</script>
<script setup>
  import { ref, watch, onMounted, nextTick, unref, computed } from 'vue';
  import Iconify from '@purge-icons/generated';
  import { isString } from 'lodash';

  const props = defineProps({
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    size: {
      type: [String, Number],
      default: 12,
    },
    prefix: {
      type: String,
    },
  });

  const elRef = ref(null);

  const icon = computed(() => props.icon || 'sa-svg-default');

  const isSvgIcon = computed(() => icon.value?.startsWith('sa-'));
  const isImage = computed(() => icon.value?.includes('.'));
  const getIconRef = computed(() => `${props.prefix ? props.prefix + ':' : ''}${props.icon}`);

  const update = async () => {
    if (unref(isSvgIcon)) return;

    const el = unref(elRef);
    if (!el) return;

    await nextTick();
    const icon = unref(getIconRef);
    if (!icon) return;

    const svg = Iconify.renderSVG(icon, {});
    if (svg) {
      el.textContent = '';
      el.appendChild(svg);
    } else {
      const span = document.createElement('span');
      span.className = 'iconify';
      span.dataset.icon = icon;
      el.textContent = '';
      el.appendChild(span);
    }
  };

  const getWrapStyle = computed(() => {
    const { size, color } = props;
    let fs = size;
    if (isString(size)) {
      fs = parseInt(size, 10);
    }

    return {
      fontSize: `${fs}px`,
      color: color,
      display: 'inline-flex',
    };
  });

  watch(() => props.icon, update, { flush: 'post' });

  onMounted(update);
</script>
