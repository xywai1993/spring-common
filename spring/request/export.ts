import { request } from "./index";

// 导出并自动下载
export const EXPORT = async (url, params) => {
  const res = await request(
    {
      url,
      method: "GET",
      params,
      responseType: "blob",
      timeout: 800000,
    },
    {
      isGetDataDirectly: false,
    }
  );
  const contentType = res.headers["content-type"];
  const filename = `${params.filename}.${params.doc_type}`;

  const downloadurl = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = downloadurl;
  link.setAttribute("download", decodeURIComponent(filename));
  document.body.appendChild(link);
  link.click();
};

export const IMPORT = async (url, data) => {
  await request(
    {
      url,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      data,
      timeout: 800000,
    },
    {
      isGetDataDirectly: false,
    }
  );
};
