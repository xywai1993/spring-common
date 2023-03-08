import { request } from "../../request";
import { CRUD } from "../../request/crud";
import { isEmpty } from "lodash";

export default {
  // 文件管理
  ...CRUD("file/admin/file"),
  upload: (params, data) =>
    request({
      url: "file/admin/file/upload",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      params,
      data,
    }),
  uploadCert: (data) =>
    request({
      url: "file/admin/file/uploadCert",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data,
    }),
  rename: (id, data) =>
    request({
      url: `file/admin/file/rename/${id}`,
      method: "POST",
      data,
    }),
  move: (id, data) =>
    request({
      url: `file/admin/file/move/${id}`,
      method: "POST",
      data,
    }),
  group: {
    ...CRUD("file/admin/group"),
  },
  config: {
    // 附件配置
    filesystem: (data) =>
      request(
        {
          url: "file/admin/config/filesystem",
          method: isEmpty(data) ? "GET" : "PUT",
          data,
        },
        {
          showSuccessMessage: !isEmpty(data),
        }
      ),
  },
};
