import { isReactive, reactive, ref, shallowRef, toRaw } from 'vue';
import { cloneDeep } from 'lodash';

export const modal = reactive({
  show: false,
});

interface FormBaseType {
  filed: string;
  label?: string;
  value?: any;
  filterType?: '=' | 'like' | 'between' | 'in';
}
/**
 * 不显示在搜索栏，为搜索栏外的额外数据,一起发送给服务端搜索用
 */
interface FormAdditionalType extends FormBaseType {
  type: 'additional';
  value: string;
}

interface FormInputType extends FormBaseType {
  type: 'input';
  label: string;
  value: string;
}

interface FormPrependInputType extends FormBaseType {
  type: 'prependInput';
  label: string;
  value: string;
  options: {
    filed: string;
    label: string;
  }[];
}

interface FormSelectType extends FormBaseType {
  type: 'select';
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface FormDateRangeType extends FormBaseType {
  type: 'dateRange';
  label: string;
  value: [string, string];
  filterType?: 'between';
}

interface FormMultiInput extends FormBaseType {
  type: 'multiInput';
  label: string;
  value: string;
  filterType?: 'in';
}

export type FormToolDataType =
  | FormInputType
  | FormMultiInput
  | FormPrependInputType
  | FormSelectType
  | FormDateRangeType
  | FormAdditionalType;

export type SearchOptions = {
  formToolData: FormToolDataType[];
  onSearch?: (d: { search: string }, searchItem: FormToolDataType[]) => void;
};

export const formToolData = ref<FormToolDataType[]>([]);
export const searchCallBack = shallowRef<{
  search?: SearchOptions['onSearch'];
}>({});

export function useCommonSearch(options: SearchOptions) {
  const openSearch = () => {
    modal.show = true;
    formToolData.value = options.formToolData;
    searchCallBack.value.search = options.onSearch;
  };
  return {
    openSearch,
  };
}

export function formToolTransition(data: FormToolDataType[]) {
  const search = {};
  const searchItem: FormToolDataType[] = [];
  data
    .filter((item) => {
      if (Array.isArray(item.value)) {
        return Boolean(item.value[0]);
      } else {
        return Boolean(item.value);
      }
    })
    .forEach((item) => {
      let v = isReactive(item.value) ? cloneDeep(toRaw(item.value)) : item.value;
      let t = item.filterType ?? '=';

      if (item.type === 'dateRange') {
        t = 'between';
        v = (v as [string, string]).join(' - ');
      }

      if (item.type === 'multiInput') {
        t = 'in';
        // @ts-ignore
        v = (v as string).split('\n');
      }

      search[item.filed] = [v, t];
      searchItem.push(cloneDeep(item));
    });

  return {
    search,
    searchItem,
  };
}
