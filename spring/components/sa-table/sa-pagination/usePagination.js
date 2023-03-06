import { reactive } from 'vue';

/**
 * @deprecated
 * @returns {{pageData: UnwrapNestedRefs<{total: number, list_rows: number, page: number}>}}
 */
const usePagination = () => {
  const pageData = reactive({
    page: 1,
    list_rows: 10,
    total: 0,
  });
  return { pageData };
};

export { usePagination };
