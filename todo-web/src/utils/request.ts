import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue';
import { router } from '../router';
import { useUserStoreWithOut } from '../store/modules/user';

function getBaseUrl() {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_GLOB_API_PROXY_PREFIX;
  } else {
    const tcbEnv = (window as any)._tcbEnv;
    return `https://${tcbEnv.TCB_SERVICE_DOMAIN}/${tcbEnv.API_NAME}`;
  }
}

const service = axios.create({
  baseURL: getBaseUrl(),
  timeout: 20000, // request timeout
});

service.interceptors.request.use(
  async (config) => {
    if (!config.headers) config.headers = new axios.AxiosHeaders();
    config.headers['content-type'] = 'application/json';
    const token = useUserStoreWithOut().token;
    config.headers['Authorization'] = token ?? '';
    config.validateStatus = (num) => num >= 200 && num < 300;
    return config;
  },
  (_) => {
    return Promise.reject('request error');
  },
);

function getErrText(error: any): string {
  if (error.data && error.data.message) {
    return error.data.message;
  } else if (error.data && typeof error.data == 'string') {
    return error.data;
  } else {
    return error.statusText;
  }
}

service.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const res: AxiosResponse = error.response;
    console.log('err', error.message, res);
    if (!res) {
      message.error('request error');
    } else {
      message.error(getErrText(res));
      if (res.status == 401) {
        router.push('/login');
      }
    }
    return Promise.reject(res);
  },
);

export default service;
