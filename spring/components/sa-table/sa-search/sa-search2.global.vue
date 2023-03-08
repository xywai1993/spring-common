<template>
  <div class="sa-filter sa-flex">
    <template v-for="(item, key) in filterTool" :key="key">
      <template v-if="key == 'tinput'">
        <div v-for="i in item" :key="i" class="filter-item sa-flex">
          <div class="filter-content">
            <el-input
              v-model="filter.data[i.key]"
              :placeholder="i.name"
              :style="{
                width: i.width + 'px',
              }"
            >
            </el-input>
          </div>
        </div>
      </template>
      <template v-if="key == 'tinputprepend'">
        <div v-for="ip in item" :key="ip" class="filter-item sa-flex">
          <div class="filter-content">
            <el-input
              v-model="filter.data[ip.key].value"
              :placeholder="ip.name"
            >
              <template #prepend>
                <el-select
                  v-model="filter.data[ip.key].field"
                  placeholder="Select"
                  :style="{
                    width: ip.width ? ip.width + 'px' : '96px',
                  }"
                >
                  <el-option
                    v-for="o in ip.options"
                    :key="o.value"
                    :label="o.label"
                    :value="o.value"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </div>
        </div>
      </template>
      <template v-if="key == 'tselect'">
        <div v-for="s in item" :key="s" class="filter-item sa-flex">
          <div class="filter-content">
            <el-select
              v-model="filter.data[s.key]"
              :placeholder="s.name"
              :style="{
                width: s.width + 'px',
              }"
            >
              <el-option
                v-for="o in s.options.data"
                :key="
                  s.options.props && s.options.props.value
                    ? o[s.options.props.value]
                    : o.value
                "
                :label="
                  s.options.props && s.options.props.label
                    ? o[s.options.props.label]
                    : o.label
                "
                :value="
                  s.options.props && s.options.props.value
                    ? o[s.options.props.value]
                    : o.value
                "
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </template>
      <template v-if="key == 'tcascader'">
        <div v-for="c in item" :key="c" class="filter-item sa-flex">
          <div class="filter-content">
            <!-- TODO: el-cascader 手机端适配-->
            <el-cascader
              v-model="filter.data[c.key]"
              :options="c.options.data"
              :props="c.options.props"
              :placeholder="c.name"
              clearable
              :style="{
                width: c.width + 'px',
              }"
            ></el-cascader>
          </div>
        </div>
      </template>
      <template v-if="key == 'tdatetimerange'">
        <div v-for="c in item" :key="c" class="filter-item sa-flex">
          <div class="filter-content">
            <!-- TODO: el-date-picker 手机端适配-->
            <el-date-picker
              v-model="filter.data[c.key]"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="[
                new Date(2000, 1, 1, 0, 0, 0),
                new Date(2000, 2, 1, 23, 59, 59),
              ]"
              :style="{
                width: c.width + 'px',
              }"
              :editable="false"
            >
            </el-date-picker>
          </div>
        </div>
      </template>
    </template>
    <div class="filter-button">
      <el-button @click="reset">重置</el-button>
      <el-button type="primary" @click="confirm">筛选</el-button>
    </div>
  </div>
</template>
<script>
/**
 * 数据 
 * 1、tinput/tinputprepend/tselect:搜索标签类型; name:提示语; key:字段; value:默认值; width:宽度; option:选项的数据; op:搜素类型
 * 2、类型为tinputprepend key要和field/value对象保持一致
 * {
  tinput: [
    {
      name: "",
      key: "",
      value: "",
      width: "",
      op: ""
    },
  ],
  tinputprepend: [
    {
      name: "kkk",
      key: "user",
      user: {
        field: "normal",
        value: "",
      },
      width: "200",
      op: "",
      options: [
        {
          label: "",
          value: "",
          op: ""
        }
      ],
    },
  ],
  tselect: [
    {
      name: "",
      key: "",
      value:"",
      width: "",
      op: "",
      options: {
        data: [],
        props: {
          label: "",
          value: "",
        }
      },
    },
  ],
  tcascader: [
    {
      name: "",
      key: "",
      value:"",
      width: "",
      op: "",
      options: {
        data: [],
        props: {
          children: "children",
          label: "title",
          value: "id",
          checkStrictly: true,
          emitPath: false,
        }
      },
    },
  ],
  tdatetimerange: [
    {
      key: "",
      value:"",
      width: "",
      op: "range",
    },
  ],
}
 */
import { reactive, watchEffect } from "vue";
import { composeFilter } from "../../../utils";
export default {
  name: "SaSearch2",
};
</script>
<script setup>
const props = defineProps({
  filterTool: {
    type: Object,
  },
});
const emit = defineEmits(["filterCallback"]);

let filter = reactive({
  data: {},
});
let defaultFilterFields = {};
const filterOp = reactive({});

function initData() {
  for (var key in props.filterTool) {
    props.filterTool[key].forEach((i) => {
      if (key == "tinputprepend") {
        filter.data[i.key] = JSON.parse(JSON.stringify(i[i.key]));
        defaultFilterFields[i.key] = JSON.parse(JSON.stringify(i[i.key]));
        // 可选择的 options
        i.options.forEach((k) => {
          filterOp[k.value] = k.op ? k.op : i.op ? i.op : "=";
        });
      } else {
        filter.data[i.key] = i.value ? JSON.parse(JSON.stringify(i.value)) : "";
        defaultFilterFields[i.key] = i.value
          ? JSON.parse(JSON.stringify(i.value))
          : "";
        filterOp[i.key] = i.op ? i.op : "=";
      }
    });
  }
}

function reset() {
  filter.data = { ...defaultFilterFields };
  confirm();
}
function confirm() {
  emit("filterCallback", composeFilter(filter.data, filterOp));
}

watchEffect(() => {
  initData();
});
</script>
<style lang="scss" scoped>
.sa-filter {
  padding: 14px 0 0;
  flex-wrap: wrap;
  .filter-item {
    margin: 0 16px 14px 0;
    .filter-content {
      width: fit-content;
    }
  }
  .filter-button {
    margin: 0 16px 14px 0;
  }
}
</style>
