<script setup>
  import { storeToRefs } from 'pinia';
  import router from '@/spring/router';
  import { useAccountStore } from '@/spring/store/account';
  import { ref } from 'vue';

  // import { toLoginRoute } from '@/utils/routes';
  // import { translateTitle } from '@/utils/i18n';
  // import { VabRoute } from '/#/router';
  //
  // const route: VabRoute = useRoute();
  // const router = useRouter();
  //
  const userStore = useAccountStore();
  // const { avatar, username } = storeToRefs(userStore);
  // const { logout } = userStore;
  //
  const active = ref(false);

  const handleVisibleChange = (val) => {
    active.value = val;
  };
  const handleCommand = async (command) => {
    switch (command) {
      case 'logout':
        // await logout();
        await userStore.logout();
        await router.push('/login');

        // await router.push(toLoginRoute(route.fullPath));
        break;
      case 'personalCenter':
        // await router.push('/setting/personalCenter');
        await router.push({ name: 'admin.profile' });
        break;
    }
  };
</script>

<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" />
      <div class="user-name">
        <span class="hidden-xs-only mr-1">{{ userStore.info.username }}</span>
        <sa-icon :icon="active ? 'ep:arrow-up' : 'ep:arrow-down'" />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter">
          <!--          <sa-icon icon="sa-setting"  size="20"/>-->
          <span>个人中心</span>
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <!--          <sa-icon icon="logout-circle-r-line" />-->
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .user-avatar {
      width: 40px;
      height: 40px;
      margin-left: 15px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      display: flex;
      align-content: center;
      align-items: center;
      height: 40px;
      margin-left: 6px;
      line-height: 40px;
      cursor: pointer;

      [class*='ri-'] {
        margin-left: 0 !important;
      }
    }
  }
</style>
