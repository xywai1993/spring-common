<template>
  <sa-icon icon="ant-design:translation" size="18" @click="change"></sa-icon>
</template>
<script lang="ts">
export default {
  name: "languageBtn",
};
</script>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useAppStore } from "../../../store/app";

const appStore = useAppStore();
const { locale } = useI18n();

const change = () => {
  const l = appStore.language === "zh" ? "en" : "zh";
  appStore.setLanguage(l);
  locale.value = l;
};
</script>
