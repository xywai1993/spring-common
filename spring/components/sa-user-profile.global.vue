<template>
  <div class="sa-user-profile" :class="type != 'oper' ? mode : ''">
    <template v-if="type != 'oper'">
      <template v-if="userData">
        <template v-if="isHover">
          <el-popover
            placement="top"
            trigger="hover"
            popper-class="profile-popover sa-popper"
          >
            <div class="sa-flex">
              <div class="avatar">
                <sa-image v-if="userData.avatar" :url="userData.avatar" />
                <img
                  v-else
                  class="default-avatar"
                  src="/static/images/chat/head.png"
                />
                <template v-if="userData">
                  <sa-svg
                    v-if="userData.gender == 0"
                    class="gender"
                    name="sa-gender-weizhi"
                  ></sa-svg>
                  <sa-svg
                    v-if="userData.gender == 1"
                    class="gender"
                    name="sa-gender-male"
                  ></sa-svg>
                  <sa-svg
                    v-if="userData.gender == 2"
                    class="gender"
                    name="sa-gender-female"
                  ></sa-svg>
                </template>
              </div>
              <div class="sa-m-l-8">
                <div class="text-name sa-table-line-1">
                  {{ userData.nickname }}
                </div>
                <div class="sa-flex">
                  <div class="id" @click="onOpen(id)">#{{ id }}</div>
                  <div class="text-desc sa-m-l-4">
                    {{ userData.username || userData.account }}
                  </div>
                </div>
              </div>
            </div>
            <template #reference>
              <div class="wrap">
                <div v-if="isAvatar" class="avatar">
                  <sa-image v-if="userData.avatar" :url="userData.avatar" />
                  <img
                    v-else
                    class="default-avatar"
                    src="/static/images/chat/head.png"
                  />
                </div>
                <div class="text-name is-hover sa-table-line-1">
                  {{ userData.nickname }}
                </div>
              </div>
            </template>
          </el-popover>
        </template>
        <div v-else class="wrap">
          <div v-if="isAvatar" class="avatar">
            <sa-image v-if="userData.avatar" :url="userData.avatar" />
            <img
              v-else
              class="default-avatar"
              src="/static/images/chat/head.png"
            />
          </div>
          <div class="text-name sa-table-line-1">
            {{ userData.nickname }}
          </div>
        </div>
      </template>
      <template v-else>
        <template v-if="type == 'agent'">
          {{ id ? "未找到用户" : id == 0 ? "平台直推" : "暂无推荐人" }}
        </template>
      </template>
    </template>
    <template v-if="type == 'oper'">
      <div class="wrap">
        <div class="avatar">
          <sa-image
            v-if="userData.type != 'system' && userData.avatar"
            :url="userData.avatar"
          />
          <img
            v-else
            class="default-avatar"
            src="/static/images/chat/head.png"
          />
        </div>
        <div class="sa-m-l-8">
          <template v-if="userData.type != 'system'">
            <div class="text-name sa-table-line-1">
              {{ userData.name || "未找到用户" }}
            </div>
            <div class="sa-flex">
              <div class="id">#{{ id }}</div>
              <div class="text-desc sa-m-l-4">
                {{ userData.type_text }}
              </div>
            </div>
          </template>
          <template v-else>{{ userData.type_text }}</template>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "sa-user-profile",
};
</script>
<script setup>
/**
 * @property {Object} user - 数据对象
 * @property {Number, String} id - ID
 * @property {String} type - 数据类型(user|agent|admin|oper)
 * @property {String} mode - 模式(row|col)
 * @property {Boolean} isAvatar - 是否显示头像
 * @property {Boolean} isHover - 是否hover详情
 */
import { computed } from "vue";

const props = defineProps({
  user: Object,
  id: [Number, String],
  type: {
    type: String,
    default: "user",
  },
  mode: {
    type: String,
    default: "row",
  },
  isAvatar: {
    type: Boolean,
    default: true,
  },
  isHover: {
    type: Boolean,
    default: true,
  },
});

const userData = computed(() => {
  let obj = props.user;

  if (props.type == "user" && !props.user) {
    obj = {
      avatar: "",
      nickname: "未找到用户",
      username: "",
    };
  }
  if (props.type == "admin" && !props.user) {
    obj = {
      avatar: "",
      nickname: "未找到用户",
      account: "",
    };
  }

  return obj;
});

function onOpen(id) {
  // useModal(UserDetail, {
  //   title: '会员详情',
  //   id,
  // });
}
</script>
<style lang="scss" scoped>
.sa-user-profile {
  width: inherit;

  .wrap {
    width: 100%;
    display: flex;
    align-items: center;
  }
  &.row {
    .wrap {
      display: flex;
      align-items: center;
    }
    .avatar {
      margin-right: 8px;
    }
  }
  &.col {
    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .avatar {
      margin-bottom: 4px;
    }
    .text-name {
      height: 16px;
      line-height: 16px;
      font-size: 12px;
    }
  }
}
.avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  position: relative;
  .sa-image {
    width: 100% !important;
    height: 100% !important;
    border-radius: 50% !important;
  }
  .default-avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .gender {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
.text-name {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: var(--sa-font);
  &.is-hover {
    color: var(--t-color-primary);
  }
}
.id,
.text-desc {
  line-height: 16px;
  font-size: 12px;
  font-weight: 400;
}
.id {
  flex-shrink: 0;
  color: var(--sa-subfont);
}
.text-desc {
  flex: 1;
  color: var(--sa-subfont);
}
.profile-popover {
  .id {
    color: var(--t-color-primary);
    cursor: pointer;
  }
}
</style>
