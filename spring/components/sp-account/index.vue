<template>
  <div class="account">
    <div class="account-item mr-2">
      <el-tooltip
        effect="light"
        content="个人信息"
        placement="bottom"
        :offset="6"
        popper-class="el-menu-tooltip"
      >
        <div class="el-menu-tooltip__trigger" @click="toView('admin.profile')">
          <sa-icon v-if="account.avatar" :icon="account.avatar" />
          <span v-else>{{ account.username }}</span>
        </div>
      </el-tooltip>
    </div>
    <div class="account-item mr-3">
      <el-tooltip
        effect="light"
        content="设置"
        placement="bottom"
        :offset="6"
        popper-class="el-menu-tooltip"
      >
        <div class="el-menu-tooltip__trigger" @click.stop="onOpenSetting">
          <sa-icon icon="sa-setting" size="24" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';
  import sheep from '@/spring';
  import { useModal } from '@/spring/hooks';
  import { useRoute, useRouter } from 'vue-router';
  import { useAccountStore } from '@/spring/store/account';
  import { useAppStore } from '@/spring/store/app';

  const accountStore = useAccountStore();
  const account = computed(() => accountStore.info);
  const appStore = useAppStore();
  const router = useRouter();
  const route = useRoute();

  // 页面跳转
  function toView(name) {
    if (name !== route.name) {
      router.push({ name: name });
    }
  }

  function onOpenSetting() {
    // 手机端菜单折叠
    if (navigator.userAgent.includes('Mobile')) {
      appStore.menuCollapse(true);
    }
  }
</script>

<style lang="scss" scoped>
  .account {
    display: flex;
    align-items: center;
  }
  .account-item {
    //width: 40px;
    height: 40px;
    padding: 0;
    position: relative;

    &:hover {
      cursor: pointer;
    }

    .el-menu-tooltip__trigger {
      //width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 20px;
      background: var(--sa-background-assist);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease-in-out;
      > .sa-image {
        width: 40px !important;
        height: 40px !important;
      }
    }
  }
</style>
