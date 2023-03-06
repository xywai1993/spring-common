<template>
  <el-container class="sa-filter-new">
    <el-main>
      <el-form ref="form" label-width="auto" label-position="top">
        <template v-for="(ft, key) in filter.tools" :key="ft">
          <el-form-item :label="ft.label" v-if="ft.type">
            <el-input
              v-if="ft.type === 'tinputprepend' && filter.data[ft.field]"
              v-model="filter.data[ft.field].value"
              :placeholder="ft.placeholder || ''"
            >
              <template #prepend>
                <el-select
                  v-model="filter.data[ft.field].field"
                  placeholder="Select"
                  :style="{
                    width: ft.width ? ft.width + 'px' : '118px',
                  }"
                >
                  <el-option
                    v-for="o in ft.options"
                    :key="o.value"
                    :label="o.label"
                    :value="o.value"
                  ></el-option>
                </el-select>
              </template>
            </el-input>
            <!-- ft.type==tinput -->
            <el-input
              v-if="ft.type === 'tinput'"
              v-model="filter.data[ft.field]"
              :placeholder="ft.placeholder || ''"
            ></el-input>
            <!-- v-if="ft.type == 'tselect'" -->
            <el-select
              v-if="ft.type === 'tselect' && ft.options.props"
              v-model="filter.data[ft.field]"
              :placeholder="ft.label"
              clearable
              :style="{
                width: ft.width + 'px',
              }"
            >
              <el-option
                v-for="o in ft.options.data"
                :key="o"
                :label="o[ft.options.props.label]"
                :value="o[ft.options.props.value]"
              ></el-option>
            </el-select>
            <!-- v-if="ft.type == 'tcascader'" -->
            <el-cascader
              v-if="ft.type === 'tcascader'"
              :ref="(el) => setCascaderRef(el, key)"
              v-model="filter.data[ft.field]"
              :options="ft.options.data"
              :props="ft.options.props"
              :placeholder="ft.label"
              clearable
              :style="{
                width: ft.width + 'px',
              }"
              size="default"
            ></el-cascader>
            <!-- v-if="ft.type == 'tdatetimerange'" -->
            <el-date-picker
              v-if="ft.type === 'tdatetimerange'"
              v-model="filter.data[ft.field]"
              type="datetimerange"
              value-format="YYYY-MM-DD HH:mm:ss"
              format="YYYY-MM-DD HH:mm:ss"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :editable="false"
            ></el-date-picker>
          </el-form-item>
        </template>
        <slot name="end" :item="filter.data"></slot>
      </el-form>
    </el-main>
    <el-footer class="sa-footer-pagination sa-row-right">
      <div class="tools-wrap">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="confirm">筛选</el-button>
      </div>
    </el-footer>
  </el-container>
</template>
<script lang="ts">
  import { nextTick, onMounted, reactive } from 'vue';
  import { isEmpty } from 'lodash';
  export default {
    name: 'SaSearch',
  };
</script>
<script lang="ts" setup>
  const props = defineProps<{
    filterParams: {
      tools: any;
      data: any;
    };
  }>();
  const emit = defineEmits(['filterBack']);

  const fp = JSON.parse(JSON.stringify(props.filterParams));

  const filter = reactive({
    tools: fp.tools,
    data: fp.data,
    conditionLabel: fp.conditionLabel,
  });

  async function reset() {
    for (let key in filter.data) {
      if (filter.tools[key].type === 'tinputprepend') {
        filter.data[key] = filter.tools[key][filter.tools[key].field];
      } else {
        filter.data[key] = filter.tools[key].value;
      }
      delete filter.conditionLabel[key];
    }
    await initLabel();
    emit('filterBack', {
      event: 'reset',
      data: filter,
    });
  }
  async function confirm() {
    await initLabel();
    emit('filterBack', {
      event: 'confirm',
      data: filter,
    });
  }

  function initLabel() {
    for (let k in filter.conditionLabel) {
      delete filter.conditionLabel[k];
    }

    for (var filed in filter.data) {
      // filed 字段
      if (filter.tools[filed] && filter.tools[filed].type) {
        // tinputprepend
        if (filter.tools[filed].type === 'tinputprepend' && !isEmpty(filter.data[filed].value)) {
          filter.conditionLabel[filed] =
            findTinputprependLabel(filter.data[filed].field, filter.tools[filed].options).label +
            ':' +
            filter.data[filed].value;
        }

        // tselect 数据保持一致
        if (filter.tools[filed].type === 'tselect') {
          if (!filter.tools[filed].options.props) {
            filter.tools[filed].options.props = {
              label: 'label',
              value: 'value',
            };
          }
        }

        if (!isEmpty(filter.data[filed])) {
          // tinput
          if (filter.tools[filed].type === 'tinput') {
            filter.conditionLabel[filed] = filter.tools[filed].label + ':' + filter.data[filed];
          }

          // tselect
          if (filter.tools[filed].type === 'tselect') {
            filter.conditionLabel[filed] =
              filter.tools[filed].label +
              ':' +
              findTselectLabel(filter.data[filed], filter.tools[filed].options)?.[
                filter.tools[filed].options.props.label
              ];
          }

          // tdatetimerange
          if (filter.tools[filed].type === 'tdatetimerange') {
            filter.conditionLabel[filed] =
              filter.tools[filed].label +
              ':' +
              (filter.data[filed] ? filter.data[filed].join(' ~ ') : '');
          }
        }
      }
    }

    // tcascader
    nextTick(() => {
      for (let c in cascaderRef) {
        if (cascaderRef[c]) {
          let text = [];
          cascaderRef[c].getCheckedNodes().forEach((l) => {
            if (l) {
              text.push(l.text);
            }
          });
          if (!isEmpty(text)) {
            filter.conditionLabel[c] = filter.tools[c].label + ':' + text.join(',');
          }
        }
      }
    });
  }

  let cascaderRef = {};
  const setCascaderRef = (el, key) => {
    if (el) {
      cascaderRef[key] = el;
    }
  };

  function findTselectLabel(value, options) {
    return options.data.find((a) => {
      return a[options.props.value] === value;
    });
  }

  function findTinputprependLabel(value, data) {
    return data.find((a) => {
      return a.value === value;
    });
  }

  onMounted(() => {
    initLabel();
  });
</script>
<style lang="scss" scoped>
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
