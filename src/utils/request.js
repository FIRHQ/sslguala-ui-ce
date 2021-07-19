import axios from "axios";
import qs from "querystring";
import { ElMessage } from "element-plus";
import { saveCookie } from 'utils/cookie';

// 创建axios实例
const service = axios.create({
  // 在请求地址前面加上baseURL
  baseURL: import.meta.env.VITE_BASE_API,
  // 当发送跨域请求时携带cookie
  // withCredentials: true,
  timeout: 20000,
});

// // 请求拦截
service.interceptors.request.use(
  (config) => {
    // 模拟指定请求令牌
    const token = window.localStorage.getItem("authToken");
    config.headers.Authorization = token;
    return config;
  },
  (error) => {
    // 请求错误的统一处理
    console.log(error); // for debug
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  /**
   * 通过判断状态码统一处理响应，根据情况修改
   * 同时也可以通过HTTP状态码判断请求结果
   */
  (response) => {
    const res = response;

    return res;
  },
  (error) => {
    // console.log('=-=-=', error.response);
    // 401: 令牌过期;
    if (error.response.status === 401) {
      // 重新登录
      ElMessage.error({
        message: "身份过期,请重新登录" || "Error",
        duration: 5 * 1000,
      });
      window.localStorage.removeItem("authToken");
      saveCookie("goback", window.location.pathname, 1);
      window.location.href = "/login";
      return;
    }
    const { response } = error;
    if (response.status === 422) {
      ElMessage.error({
        message: response.data.error || response.data || "Error",
        duration: 5 * 1000,
      });
    } else {
      ElMessage({
        message: error.message,
        type: "error",
        duration: 5 * 1000,
      });
    }
    return Promise.reject(error);
  },
);

export default class httpUtil {
  static get(url, params) {
    return new Promise((resolve, reject) => {
      if (params) {
        url = `${url}?${qs.stringify(params)}`;
      }
      service
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static post(url, params) {
    return new Promise((resolve, reject) => {
      service
        .post(url, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  static put(url, params) {
    return new Promise((resolve, reject) => {
      service
        .put(url, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }

  static delete(url, params) {
    return new Promise((resolve, reject) => {
      service
        .delete(url, {
          params,
          paramsSerializer: (pams) =>
            qs.stringify(pams, { arrayFormat: "brackets" }),
        })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => reject(error));
    });
  }

  static patch(url, params) {
    return new Promise((resolve, reject) => {
      axios
        .patch(url, params)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => reject(error));
    });
  }
}
