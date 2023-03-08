// 通用资源操作请求
import { request } from "../request";

const CRUD = (path) => {
  return {
    // 查看列表
    list: (params) =>
      request({
        url: path,
        params,
      }),
    // 新增
    add: (data) =>
      request({
        url: path,
        method: "POST",
        data,
        options: {
          showSuccessMessage: true,
        },
      }),
    // 详情
    detail: (id) =>
      request({
        url: path + `/${id}`,
      }),
    // 编辑&更新
    edit: (id, data) =>
      request({
        url: path + `/${id}`,
        method: "PUT",
        data,
        options: {
          showSuccessMessage: true,
        },
      }),
    // 删除
    delete: (id, is_real = 0) =>
      request({
        url: path + `/${id}`,
        method: "DELETE",
        options: {
          showSuccessMessage: true,
        },
        data: {
          is_real,
        },
      }),
  };
};

export default CRUD;
