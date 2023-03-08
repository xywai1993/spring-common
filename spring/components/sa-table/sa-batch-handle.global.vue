<template>
  <div class="sa-batch-handle sa-flex">
    <span class="tip">
      已选择
      <span>{{ selectedLeng }}</span> 项
    </span>
    <div class="tools-pc">
      <el-button
        v-auth="item.auth"
        :class="item.class"
        v-for="item in batchHandleTools"
        :key="item"
        :type="item.buttonType"
        plain
        :disabled="item.operType != 'all' && selectedLeng == 0"
        @click="batchHandle(item.type)"
        >{{ item.label }}</el-button
      >
    </div>
    <!--    <div class="tools-mobile">-->
    <!--      <el-dropdown popper-class="goods-dropdown" @command="batchHandle">-->
    <!--        <el-button>-->
    <!--          下拉菜单-->
    <!--          <el-icon class="el-icon&#45;&#45;right">-->
    <!--            <ArrowDown />-->
    <!--          </el-icon>-->
    <!--        </el-button>-->
    <!--        <template #dropdown>-->
    <!--          <el-dropdown-menu>-->
    <!--            <template v-for="item in batchHandleTools" :key="item">-->
    <!--              <el-dropdown-item v-if="checkAuth(item.auth)" :command="item.type">-->
    <!--                <el-button-->
    <!--                  class="is-link"-->
    <!--                  :type="item.class"-->
    <!--                  :disabled="item.operType != 'all' && selectedLeng == 0"-->
    <!--                >-->
    <!--                  {{ item.label }}-->
    <!--                </el-button>-->
    <!--              </el-dropdown-item>-->
    <!--            </template>-->
    <!--          </el-dropdown-menu>-->
    <!--        </template>-->
    <!--      </el-dropdown>-->
    <!--    </div>-->
  </div>
</template>
<script>
export default {
  name: "SaBatchHandle",
};
</script>
<script setup>
/**
   * @param {Array} batchHandleTools - 批量操作数据
   * {
      type: 'delete', // 操作请求api类型区分
      label: '删除', // 按钮label
      auth: '', // 权限
      buttonType: 'danger', // 按钮类型
      class: 'danger', // 按钮className
      operType: '', // 操作类型(all=全部操作,不需要选中)
    }
   * @param {Number} selectedLeng - 批量操作是否选中数据
   */
import { checkAuth } from "../../directives/auth";
import { ElMessage } from "element-plus";

const emit = defineEmits(["batchHandle"]);
const props = defineProps({
  batchHandleTools: {
    type: Array,
  },
  selectedLeng: {
    type: Number,
  },
});

function batchHandle(type) {
  const findItem = props.batchHandleTools.find((item) => item.type == type);
  if (findItem.operType != "all" && props.selectedLeng == 0) {
    ElMessage({
      message: "请先选择操作数据",
      type: "warning",
    });
  } else {
    emit("batchHandle", type);
  }
}
</script>
<style lang="scss" scoped>
.danger {
  --el-button-hover-text-color: var(--el-color-danger);
  --el-button-hover-border-color: var(--el-color-danger);
  --el-button-active-border-color: var(--el-color-danger);
}
.success {
  --el-button-hover-text-color: var(--el-color-success);
  --el-button-hover-border-color: var(--el-color-success);
  --el-button-active-border-color: var(--el-color-success);
}
.info {
  --el-button-hover-text-color: var(--el-color-info);
  --el-button-hover-border-color: var(--el-color-info);
  --el-button-active-border-color: var(--el-color-info);
}
.warning {
  --el-button-hover-text-color: var(--el-color-warning);
  --el-button-hover-border-color: var(--el-color-warning);
  --el-button-active-border-color: var(--el-color-warning);
}

.sa-batch-handle {
  .tip {
    font-size: 12px;
    color: var(--sa-font);
    margin-right: 12px;
  }

  .tools-pc,
  .tools-mobile {
    display: none;
  }

  @media only screen and (min-width: 768px) {
    .tools-pc {
      display: flex;
    }
  }

  @media only screen and (max-width: 768px) {
    .tools-mobile {
      display: flex;
    }
  }
}
</style>
