<template>
  <el-drawer
    class="sa-drawer sa-filter-drawer"
    v-model="modal.show"
    title="筛选"
    direction="rtl"
    :before-close="handleClose"
    :size="432"
    :destroy-on-close="true"
  >
    <template #header>
      <div class="title">
        <span>筛选</span>
      </div>
    </template>
    <el-container class="sa-filter-new">
      <el-main>
        <el-form ref="form" label-width="auto" label-position="top">
          <el-form-item v-for="formItem in formToolData" :label="formItem.label">
            <template v-if="formItem.type === 'prependInput'">
              <el-input v-model="formItem.value" placeholder="输入查询内容">
                <template #prepend>
                  <el-select v-model="formItem.filed" style="width: 115px">
                    <el-option
                      v-for="op in formItem.options"
                      :key="op.filed"
                      :label="op.label"
                      :value="op.filed"
                    ></el-option>
                  </el-select>
                </template>
              </el-input>
            </template>

            <template v-if="formItem.type === 'input'">
              <el-input v-model="formItem.value" placeholder="输入查询内容"></el-input>
            </template>

            <template v-if="formItem.type === 'multiInput'">
              <el-input
                type="textarea"
                v-model="formItem.value"
                placeholder="输入单号查询,回车换行"
              ></el-input>
            </template>

            <template v-if="formItem.type === 'select'">
              <el-select v-model="formItem.value">
                <el-option
                  v-for="op in formItem.options"
                  :key="op.value"
                  :label="op.label"
                  :value="op.value"
                ></el-option>
              </el-select>
            </template>

            <template v-if="formItem.type === 'dateRange'">
              <el-date-picker
                v-model="formItem.value"
                type="datetimerange"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :editable="false"
              ></el-date-picker>
            </template>
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer class="sa-footer-pagination sa-row-right">
        <div class="tools-wrap">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="filterHandle">筛选</el-button>
        </div>
      </el-footer>
    </el-container>
    <!--    <component :is="modal.componentId" :filterParams="modal.params" @filterBack="filterBack" />-->
  </el-drawer>
</template>

<script lang="ts" setup>
  import { markRaw, reactive, toRaw, unref, isReactive } from 'vue';
  import { modal, formToolData, searchCallBack, formToolTransition } from './useCommonSearch';
  import { cloneDeep } from 'lodash';

  function handleClose() {
    modal.show = false;
  }

  function filterBack(data) {
    modal.show = false;
  }
  // {"order_status":["All","="],"order_sn":["11222","like"],"user.nickname":["adadada","like"],"item.goods_title":["2233","like"],"create_time":["2022-12-17 00:00:00 - 2023-01-17 23:59:59","range"]}

  const filterHandle = () => {
    const { searchItem, search } = formToolTransition(formToolData.value);

    if (searchCallBack.value.search) {
      searchCallBack.value.search({ search: JSON.stringify(search) }, searchItem);
    }

    modal.show = false;
  };

  const reset = () => {
    formToolData.value.forEach((item) => {
      // 外部数据不需要重置
      if (item.type !== 'additional') {
        item.value = '';
      }
    });
  };
</script>
<style lang="scss">
  .sa-filter-drawer {
    .el-drawer__header {
      height: 56px;
      line-height: 56px;
      margin: 0;
      padding: 0 var(--sa-padding);
      border-bottom: 1px solid var(--sa-border);
    }

    .title {
      font-size: 16px;
      color: var(--sa-title);

      span {
        width: fit-content;
        line-height: 1;
        padding: 0 2px;
        position: relative;
        z-index: 2;

        &:after {
          pointer-events: none;
          content: '';
          position: absolute;
          height: 8px;
          background: var(--t-bg-active);
          bottom: 0;
          right: 0;
          left: 0;
          z-index: -1;
        }
      }
    }

    .el-drawer__body {
      padding: 0 !important;
      display: flex;
      width: 100%;

      & > div {
        height: 100%;
        display: flex;
      }
      .el-input,
      .el-select,
      .el-cascader,
      .el-textarea {
        width: 100%;
        max-width: unset;
      }
    }
  }
  .sa-filter-new {
    .sa-footer-pagination {
      border-top: 1px solid var(--sa-border);
      box-shadow: none;
      .tools-wrap {
        width: 100%;
        justify-content: flex-end;
      }
    }
  }
</style>
