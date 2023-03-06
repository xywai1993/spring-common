import { request, RequestOptions } from '@/spring/request';
import { EXPORT } from '@/spring/request/export';

type GetListType = {
  list: any[];
  current_page: number;
  total: number;
  page_size: number;
};

export type ObjectType = {
  [prop: string]: any;
};

export class ModuleApi<T extends string> {
  API = {
    getIndex: `index`,
    postStore: `store`,
    getInfo: `info`,
    postUpdate: `update`,
    postDelete: `delete`,
    postCheck: `check`,
    postExport: `export`,
  };
  module: T;
  constructor(module: T) {
    this.module = module;
    if (module) {
      for (const apiKey in this.API) {
        this.API[apiKey] = `${module}/${this.API[apiKey]}`;
      }
    }
  }

  Post<P extends ObjectType>(url: string, data: any, options?: RequestOptions) {
    return request<P>(
      {
        method: 'post',
        url: this.ModuleUrl(url),
        data,
      },
      options,
    );
  }

  Get<G extends ObjectType>(url: string, data: any = {}, options?: RequestOptions) {
    return request<G>(
      {
        method: 'get',
        url: this.ModuleUrl(url),
        params: data,
      },
      options,
    );
  }
  /**
   * 返回带模块名的URL
   * @param url
   * @constructor
   */
  ModuleUrl(url: string) {
    if (url.startsWith('/')) {
      return `${this.module}${url}`;
    } else {
      return `${this.module}/${url}`;
    }
  }

  /**
   * 获取列表
   * @constructor
   */
  GetList(queryData = {}, page = 1, page_size = 100) {
    const query = Object.assign({}, queryData, { page, page_size });
    return request<GetListType>({
      method: 'get',
      url: this.API.getIndex,
      params: query,
    });
  }

  /**
   * 创建
   * @constructor
   */
  PostStore(data: any, options?: RequestOptions) {
    return request(
      {
        method: 'POST',
        url: this.API.postStore,
        data,
      },
      options,
    );
  }

  /**
   * 获取详情
   * @param id
   * @constructor
   */
  GetDetail(id) {
    return request({
      method: 'get',
      url: this.API.getInfo,
      params: { id },
    });
  }

  /**
   * 编辑更新
   * @constructor
   * @param data
   * @param options
   */
  PostUpdate(data: any, options?: RequestOptions) {
    return request(
      {
        method: 'POST',
        url: this.API.postUpdate,
        data,
      },
      options,
    );
  }

  /**
   * 删除
   * @param id
   * @param options
   * @constructor
   */
  PostDel(id: string | string[], options?: RequestOptions) {
    return request(
      {
        method: 'post',
        url: this.API.postDelete,
        params: { id },
      },
      options,
    );
  }

  /**
   * 导出表格
   * @param data
   * @param options
   * @constructor
   */
  PostExports(data: { doc_type: 'csv' | 'xlsx'; columns: string; filename: string; id?: string }) {
    // return request(
    //   {
    //     method: 'GET',
    //     url: this.API.postExport,
    //     params: data,
    //   },
    //   options,
    // );

    return EXPORT(this.API.postExport, data);
  }
}
