import { useDrawer } from "../../sa-drawer/useDrawer";

type TtinputprependType = {
  type: "tinputprepend";
  label: string;
  field: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
};

type TselectType = {
  type: "tselect";
  label: string;
  field: string;
  value: string;
  options: {
    data: any[];
    props: {
      label: string;
      value: string;
    };
  };
};

type TinputType = {
  type: "tinput";
  label: string;
  field: string;
  value: string;
};

type TdatetimerangeType = {
  type: "tdatetimerange";
  label: string;
  field: string;
  value: string[];
};

export type SearchOptions = {
  filterParams: {
    tools: {
      [prop: string]:
        | TdatetimerangeType
        | TinputType
        | TselectType
        | TtinputprependType
        | { type: "default"; label: string; value: string };
    };
    data: any;
    conditionLabel: any;
  };
  getData: (p: any) => void;
  comp?: any;
};

/**
 * @deprecated
 * @param options
 */
export function useSearch(options: SearchOptions) {
  const openFilter = () => {
    useDrawer({
      ...options,
      confirm: (data) => {
        options.filterParams.tools = data.tools;
        options.filterParams.data = data.data;
        options.filterParams.conditionLabel = data.conditionLabel;
        options.getData(1);
      },
      reset: (data) => {
        options.filterParams.tools = data.tools;
        options.filterParams.data = data.data;
        options.filterParams.conditionLabel = data.conditionLabel;
        options.getData(1);
      },
      close: (data) => {},
    });
  };
  const deleteFilter = (key) => {
    if (options.filterParams.tools[key].type === "tinputprepend") {
      options.filterParams.data[key] =
        options.filterParams.tools[key][options.filterParams.tools[key].field];
    } else {
      options.filterParams.data[key] = options.filterParams.tools[key].value;
    }
    delete options.filterParams.conditionLabel[key];

    options.getData(1);
  };
  return {
    openFilter,
    deleteFilter,
  };
}
