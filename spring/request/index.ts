// 请求
import axios, { AxiosRequestConfig } from 'axios';
import $storage from '@/spring/utils/storage';
import { ElMessage, ElMessageBox } from 'element-plus';
import { baseURL } from '@/spring/config';
import { useAccountStore } from '@/spring/store/account';
import { useAppStore } from '@/spring/store/app';

export type Response<T = any> = {
  code: number;
  msg: string;
  data: T;
};

/**
 * @description axios
 */
const service = axios.create({
  baseURL,
  timeout: 6000,
  method: 'GET',
  headers: {
    // "Accept": "*/*",
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

/**
 * @description axios请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    const token = $storage.get('token');
    const appStore = useAppStore();
    appStore.setRequestCounter(1);
    if (token && config.headers) {
      config.headers['Authorization'] = 'ddr ' + token;
    }
    return config;
  },
  (error) => {
    const appStore = useAppStore();
    appStore.setRequestCounter(-1);
    return Promise.reject(error);
  },
);

/**
 * @description axios响应拦截器
 */
service.interceptors.response.use(
  (response) => {
    const appStore = useAppStore();
    // 导出&下载文件
    if (response.config.responseType === 'blob' && response.data.size > 0) {
      appStore.setRequestCounter(-1);
      return Promise.resolve(response);
    }
    const accountStore = useAccountStore();

    appStore.setRequestCounter(-1);
    const data: Response = response.data;

    let errorMessage = '操作失败';

    if (Number(data.code) === 401) {
      if (document.getElementsByClassName('el-message-box').length === 0) {
        ElMessageBox.alert(data.msg || errorMessage, '认证失败', {
          confirmButtonText: '重新登陆',
        }).then(() => {
          accountStore.logout(true);
        });
      }
      return Promise.reject(response);
    }

    if (data.code !== 200) {
      ElMessage.error(data.msg || '未知错误');
      return Promise.reject(response.data);
    }

    return Promise.resolve(response.data);
  },
  (error) => {
    let errorMessage = '未知错误';
    console.warn(`error->${error}`);
    ElMessage.error(errorMessage);
    return false;
  },
);

/**
 * 业务上的请求参数
 */
export type RequestOptions = {
  /**
   * @default true
   */
  isGetDataDirectly?: boolean;
  /**
   * @default false
   * @deprecated
   */
  showSuccessMessage?: boolean;
  successMessage?: string;
};

/**
 *
 * @param config
 * @param options
 */
export const request = async <T = any>(
  config: AxiosRequestConfig,
  options: RequestOptions = {},
): Promise<T> => {
  try {
    const { isGetDataDirectly = true, successMessage } = options;
    const res = await service.request(config);
    successMessage && ElMessage.success(successMessage || res.data?.msg);
    return isGetDataDirectly ? res.data : res;
  } catch (error: any) {
    return Promise.reject(error);
  }
};
