import { request } from './index';

// 查看列表
export const LIST = (url, params) =>
  request({
    url,
    params,
  });

// 查看详情
export const DETAIL = (url, id) =>
  request({
    url: url + `/${id}`,
  });

// 新增
export const ADD = (url, data) =>
  request({
    url,
    method: 'POST',
    data,
    options: {
      showSuccessMessage: true,
    },
  });

// 编辑&更新
export const EDIT = (url, id, data) =>
  request({
    url: url + `/${id}`,
    method: 'PUT',
    data,
    options: {
      showSuccessMessage: true,
    },
  });

// 删除(软删除/真实删除)
export const DELETE = (url, id) =>
  request({
    url: url + `/${id}`,
    method: 'DELETE',
    options: {
      showSuccessMessage: true,
    },
  });

// 选择
export const SELECT = (url, params) =>
  request({
    url: url + '/select',
    method: 'GET',
    params,
  });

// 回收站列表
export const RECYCLE_BIN = (url, params) =>
  request({
    url: url + '/recyclebin',
    method: 'GET',
    params,
  });

// 销毁
export const DESTROY = (url, id) =>
  request({
    url: url + '/destroy/' + id,
    method: 'DELETE',
  });

// 还原
export const RESTORE = (url, id) =>
  request({
    url: url + '/restore/' + id,
    method: 'PUT',
  });

// 通用增删改查
export const CRUD = (url, methods = ['list', 'detail', 'add', 'edit', 'delete']) => {
  const apis = {};
  if (methods.includes('list')) apis.list = (params) => LIST(url, params);
  if (methods.includes('detail')) apis.detail = (id) => DETAIL(url, id);
  if (methods.includes('add')) apis.add = (data) => ADD(url, data);
  if (methods.includes('edit')) apis.edit = (id, data) => EDIT(url, id, data);
  if (methods.includes('delete')) apis.delete = (id) => DELETE(url, id);
  return apis;
};

// 通用回收站
export const RECYCLE = (url) => {
  return {
    recyclebin: (params) => RECYCLE_BIN(url, params),
    restore: (id) => RESTORE(url, id),
    destroy: (id) => DESTROY(url, id),
  };
};

// add, list, delete, edit, detail, select, recyclebin, restore, destroy
