import { ModuleApi } from "./useModuleApi";
import { onMounted, reactive, ref, shallowRef, watch } from "vue";
import {
  FormToolDataType,
  formToolTransition,
  useCommonSearch,
} from "../components/sp-common-search/useCommonSearch";

type QueryDataType = {
  [propName: string]: string | number;
};

type Options = {
  /**
   * 是否立即获取数据
   */
  immediate?: boolean;
  page_size?: number;
};

/**
 * 通用界面逻辑函数
 * @param moduleApi
 * @param formToolData
 * @param params
 */
export function useMain<T extends any>(
  moduleApi: ModuleApi<string>,
  formToolData: FormToolDataType[] = [],
  params: Options = {}
) {
  const serverList = shallowRef<T[]>();
  const condition = ref<FormToolDataType[]>([]);
  const serverLoading = ref(false);
  const options = Object.assign({ immediate: true, page_size: 10 }, params);

  const paginationData = reactive({
    page: 1,
    page_size: options.page_size,
    total: 0,
  });
  const queryData: QueryDataType = reactive({});

  onMounted(() => {
    if (options.immediate) {
      getList().then();
    }
  });

  /**
   * 优先使用指定的数据查询， 次优先搜索框内的数据
   * @param query
   */
  const getList = (query: { [propName: string]: any } | null = null) => {
    let q = {};

    if (query) {
      q = query;
      condition.value = [];
    }

    if (condition.value.length) {
      const { search } = formToolTransition(condition.value);
      q = { search: JSON.stringify(search) };
    }

    q = { ...queryData, ...q };
    serverLoading.value = true;
    return moduleApi
      .GetList(q, paginationData.page, paginationData.page_size)
      .then((d) => {
        serverList.value = d.list;
        paginationData.total = d.total;
        paginationData.page = d.current_page;
        paginationData.page_size = d.page_size;
        serverLoading.value = false;
        return d;
      })
      .catch(() => {
        serverLoading.value = false;
      });
  };
  const delItem = (id: string) => {
    moduleApi.PostDel(id).then(() => getList());
  };

  const onSearch = (query, items) => {
    getList(query).then();
    condition.value = items;
  };

  watch([() => paginationData.page, () => paginationData.page_size], () => {
    getList().then();
  });

  // 页面查询
  const { openSearch } = useCommonSearch({
    formToolData,
    onSearch,
  });
  return {
    serverList,
    paginationData,
    condition,
    getList,
    delItem,
    queryData,
    serverLoading,
    openSearch,
  };
}

export function useEditMain() {
  const showEditDialog = ref(false);
  const currentId = ref<null | string>("");

  const onUpdateItem = (getList: () => void) => {
    getList();
    currentId.value = null;
  };
  const edit = (id) => {
    showEditDialog.value = true;
    currentId.value = id;
  };

  return {
    showEditDialog,
    currentId,
    onUpdateItem,
    edit,
  };
}
