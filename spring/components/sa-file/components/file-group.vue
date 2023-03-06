<template>
  <el-container class="group">
    <el-main>
      <div
        v-for="(gitem, index) in groupList"
        :key="gitem"
        class="group-item sa-flex sa-row-between"
        :class="modelValue == gitem.group ? 'is-active' : ''"
        @click="emit('update:modelValue', gitem.group)"
      >
        <span class="sa-line-1">{{ gitem.name }}</span>
        <el-popover
          v-model:visible="groupPopover.flag[index]"
          placement="top"
          :width="210"
          trigger="click"
        >
          <el-form
            :ref="'groupRef' + gitem.id"
            :model="form.model"
            :rules="form.rules"
            label-width="0"
          >
            <el-form-item prop="name">
              <el-input v-model="form.model.name" placeholder="分组名称"></el-input>
            </el-form-item>
            <el-form-item prop="group">
              <el-input
                v-model="form.model.group"
                placeholder="分组标识/文件夹名称(字母)"
                :disabled="groupPopover.currentRef != 'add'"
                @keyup="form.model.group = form.model.group.replace(/[^\a-\z\A-\Z]/g, '')"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="sa-flex sa-row-between">
            <el-button
              v-auth="'file.admin.group.delete'"
              class="is-link"
              type="danger"
              size="small"
              @click="onDeleteGroup"
            >
              删除
            </el-button>
            <div class="sa-flex">
              <el-button
                v-auth="'file.admin.group.edit'"
                class="is-link"
                type="primary"
                size="small"
                @click="onConfirmGroup"
                >完成</el-button
              >
            </div>
          </div>
          <template #reference>
            <el-button class="is-link edit" type="primary" @click.stop="onEditGroup(gitem)"
              >编辑</el-button
            >
          </template>
        </el-popover>
      </div>
    </el-main>
    <el-footer>
      <el-popover
        v-model:visible="groupPopover.visible"
        placement="top"
        :width="210"
        trigger="click"
      >
        <el-form
          :ref="'groupRef' + groupPopover.currentRef"
          :model="form.model"
          :rules="form.rules"
          label-width="0"
        >
          <el-form-item prop="name">
            <el-input v-model="form.model.name" placeholder="分组名称"></el-input>
          </el-form-item>
          <el-form-item prop="group">
            <el-input
              v-model="form.model.group"
              placeholder="分组标识/文件夹名称(字母)"
              :disabled="groupPopover.currentRef != 'add'"
              @keyup="form.model.group = form.model.group.replace(/[^\a-\z\A-\Z]/g, '')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="sa-flex sa-row-right">
          <el-button class="is-link" type="info" size="small" @click="onCancelGroup">
            取消
          </el-button>
          <el-button class="is-link" type="primary" size="small" @click="onConfirmGroup"
            >创建</el-button
          >
        </div>
        <template #reference>
          <el-button
            v-auth="'file.admin.group.add'"
            class="add sa-m-l-0"
            icon="Plus"
            @click.stop="onAddGroup('add')"
            >新建分组</el-button
          >
        </template>
      </el-popover>
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'FileGroup',
  };
</script>

<script setup>
  import { getCurrentInstance, reactive, ref } from 'vue';
  import fileApi from '../api';
  import { cloneDeep } from 'lodash';

  const emit = defineEmits(['update:modelValue', 'updateGroupList']);
  const props = defineProps(['groupList', 'modelValue']);

  const { proxy } = getCurrentInstance();

  const groupPopover = reactive({
    flag: {},
    currentRef: 'add',
    visible: false,
  });

  // 添加分组
  function onAddGroup() {
    form.model = {
      name: '',
      group: '',
      id: '',
    };
    groupPopover.currentRef = 'add';
  }

  // 编辑分组
  function onEditGroup(item) {
    form.model = {
      name: item.name,
      group: item.group,
      id: item.id,
    };
    groupPopover.currentRef = item.id;
  }

  const groupRef = ref();
  const form = reactive({
    model: {
      name: '',
      group: '',
      id: '',
    },
    rules: {
      name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
      group: [{ required: true, message: '请输入分组标识', trigger: 'blur' }],
    },
  });

  // 取消
  function onCancelGroup() {
    groupPopover.visible = false;
    groupPopover.flag = {};
  }

  // 确定分组
  function onConfirmGroup() {
    (groupPopover.currentRef == 'add'
      ? proxy.$refs['groupRef' + groupPopover.currentRef]
      : proxy.$refs['groupRef' + groupPopover.currentRef][0]
    ).validate(async (valid) => {
      if (!valid) return;
      const subform = cloneDeep(form.model);
      if (!subform.id) {
        delete subform.id;
        await fileApi.group.add(subform);
      } else {
        await fileApi.group.edit(subform.id, subform);
      }
      onCancelGroup();
      emit('updateGroupList');
    });
  }

  // 删除分组
  async function onDeleteGroup() {
    await fileApi.group.delete(groupPopover.currentRef);
    onCancelGroup();
    emit('updateGroupList');
  }
</script>
<style lang="scss" scoped>
  .group {
    height: 100%;
    .el-main {
      --el-main-padding: 16px;
      .group-item {
        width: 100%;
        height: 32px;
        padding: 0 16px;
        border-radius: 4px;
        margin-bottom: 4px;
        font-size: 14px;
        cursor: pointer;
        &.is-active {
          background: var(--t-bg-active);
          color: var(--el-color-primary);
        }
        &:hover {
          background: var(--t-bg-hover);
          .edit {
            display: block;
          }
        }
        .edit {
          display: none;
          margin: 0 0 0 10px;
        }
      }
    }
    .el-footer {
      --el-footer-height: 44px;
      .add {
        width: 100%;
        @media only screen and (max-width: 768px) {
          display: none;
        }
      }
    }
  }

  @media only screen and (max-width: 768px) {
    .group {
      flex-direction: row;
      .el-main {
        --el-main-padding: 14px 0;
        display: flex;
        overflow-y: hidden;
        .group-item {
          margin-bottom: 0;
          &:hover {
            .edit {
              display: none;
            }
          }
        }
        .edit {
          display: none;
        }
      }
      .el-footer {
        --el-footer-padding: 14px 0;
        --el-footer-height: 60px;
      }
    }
  }
</style>
