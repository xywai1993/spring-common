<template>
  <div class="setting-main">
    <!-- 系统信息 -->
    <div class="setting-item">
      <div class="setting-item__title">
        系统信息
        <div class="setting-close">
          <el-icon class="icons-circle-close"><CircleClose /></el-icon>
          <el-icon
            class="icons-circle-close-filled"
            @click="emit('modalCallBack', { event: 'confirm' })"
            ><CircleCloseFilled
          /></el-icon>
          <i></i>
        </div>
      </div>
      <div class="setting-item__wrap sa-flex">
        <sa-image size="64" :url="appInfo.logo" radius="16"></sa-image>
        <div class="sa-m-l-16">
          <div class="name">{{ appInfo.name }}</div>
          <div class="version">{{ appInfo.version }}</div>
        </div>
      </div>
    </div>
    <!-- 外观 -->
    <div class="setting-item">
      <div class="setting-item__title">外观</div>
      <div class="setting-item__wrap">
        <div class="title">选择主题</div>
        <div class="contant sa-flex sa-flex-wrap">
          <div
            class="setting-item__theme sa-m-b-32"
            v-for="item in themeData"
            :key="item"
            @click="changeTheme(item.name)"
          >
            <div class="theme-image" :class="item.name == appLayout.theme ? 'active' : ''">
              <img v-if="item.name == 'sheep'" src="/static/images/theme/sheep.png" />
              <img v-if="item.name == 'element'" src="/static/images/theme/element.png" />
              <img v-if="item.name == 'classical'" src="/static/images/theme/classical.png" />
            </div>
            <div class="name">
              {{ item.name.substring(0, 1).toUpperCase() + item.name.substring(1) }}
            </div>
          </div>
        </div>
        <div class="title">模式</div>
        <div class="contant sa-flex">
          <el-radio-group v-model="appLayout.darkMode" @change="changeDarkMode">
            <el-radio-button label="light">明亮模式</el-radio-button>
            <el-radio-button label="dark">暗黑模式</el-radio-button>
            <el-radio-button label="system">跟随系统</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <!-- 缓存 -->
    <div class="setting-item">
      <div class="setting-item__title">缓存</div>
      <div class="setting-item__wrap">
        <div class="contant sa-flex sa-flex-wrap">
          <el-button type="primary" plain @click="clearCache">清除缓存</el-button>
        </div>
      </div>
    </div>
  </div>
  <!-- 关于我们 -->
  <div class="setting-footer">
    <div class="setting-footer__top sa-flex">
      <a href="" target="_blank">官方网站</a>
      <a href="" target="_blank">开发文档</a>
    </div>
    <div class="setting-footer__bottom"> Copyright © Spring admin All Rights Reserved. </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import admin from '@/modules/Admin/api';
  import { ElMessageBox } from 'element-plus';
  import { useApp } from '@/spring/hooks';
  import { setTheme, setDarkMode } from '@/spring/hooks/useTheme';

  const { appInfo, appLayout } = useApp();

  const emit = defineEmits(['modalCallBack']);
  const props = defineProps(['modal']);

  const themeData = reactive([
    {
      name: 'sheep',
    },
    {
      name: 'element',
    },
    {
      name: 'classical',
    },
  ]);
  // 切换主题
  const changeTheme = (e) => {
    setTheme(e);
  };
  // 切换暗黑模式
  const changeDarkMode = (e) => {
    setDarkMode(e);
  };

  function clearCache() {
    ElMessageBox.confirm('确定清除缓存?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(async () => {
      await admin.clearCache();
    });
  }
</script>

<style lang="scss">
  .sa-dialog {
    &.app-setting-dialog {
      --el-dialog-background-color: transparent !important;
      background: var(--sa-mask-background);
      -webkit-backdrop-filter: blur(16px);
      backdrop-filter: blur(16px);
      .el-dialog__header {
        display: none !important;
      }

      .el-dialog__body {
        height: 100%;
        overflow: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 30px 20px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .app-setting {
    cursor: pointer;
  }
  .setting-main {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    min-width: 300px;
    width: 40%;
    padding: 64px 0 0 0;
  }
  .setting-item {
    width: 100%;
    &__title {
      margin-bottom: 32px;
      font-size: 24px;
      line-height: 24px;
      font-weight: 800;
      color: var(--sa-subtitle);
      width: 100%;
      position: relative;
      text-align: left;
      .setting-close {
        position: absolute;
        top: -56px;
        right: 0;
        i {
          font-size: 32px;
        }
        .icons-circle-close {
          display: block;
        }
        .icons-circle-close-filled {
          display: none;
        }
        &:hover {
          .icons-circle-close {
            display: none;
          }
          .icons-circle-close-filled {
            display: block;
            color: var(--el-color-primary);
          }
        }
      }
    }
    &__wrap {
      margin: 0 0 48px;
      color: var(--sa-font);
      .name {
        font-size: 22px;
        line-height: 22px;
        font-weight: bold;
        margin-bottom: 12px;
      }
      .version {
        font-size: 18px;
        line-height: 18px;
      }
      .title {
        font-weight: bold;
        font-size: 16px;
        line-height: 16px;
        margin-bottom: 24px;
      }
    }
    &__theme {
      margin: 0 24px 0 0;

      .theme-image {
        width: 108px;
        height: 72px;
        background: var(--sa-page-background);
        border: 2px solid var(--sa-border);
        border-radius: 4px;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        &:hover {
          border-color: var(--t-btn-hover);
        }
        &.active {
          border-color: var(--el-color-primary);
        }
        img {
          width: 100%;
        }
      }
      .name {
        font-size: 16px;
        line-height: 16px;
        color: var(--sa-font);
        margin: 12px 0 0 0;
      }
    }
  }
  .setting-footer {
    color: var(--sa-title);
    &__top {
      font-size: 12px;
      margin: 0 0 16px 0;
      justify-content: space-around;
      a {
        color: var(--sa-title) !important;
      }
    }
    &__bottom {
      font-size: 11px;
    }
  }
</style>
