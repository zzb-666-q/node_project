import axios from 'axios';
import Vue from 'vue';
import { Notification, MessageBox, Message, Loading } from 'element-ui';
import errorCode from '@/utils/errorCode';
import { tansParams, blobValidate } from '@/utils/slms';
import { tokenUrl } from '@/tokenUrl/tokenUrl.js';
import store from '@/store';
import { addreqQueue, removereqQueue } from './cache';

// let downloadLoadingInstance;
// // 是否显示重新登录
export let isRelogin = { show: false };

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: 'http://127.0.0.1:9000',
  baseURL: '/apis',

  // 超时
  timeout: 10000,
});

// 正在进行中的请求列表
let reqList = [];

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
const stopRepeatRequest = function (reqList, url, cancel, errorMessage) {
  const errorMsg = errorMessage || '';
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMsg);
      return;
    }
  }
  reqList.push(url);
};

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
const allowRequest = function (reqList, url) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1);
      break;
    }
  }
};

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    if (tokenUrl.indexOf(config.url) > -1) {
      //获取cookie
      let token = Vue.$cookies.get('token');

      //将token挂在到请求头中
      config.headers.token = token;
    }
    // if (getToken() && !isToken) {
    //   config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }

    /**
     * 阻止重复请求。当上个请求未完成时，相同的请求不会进行
     */
    let cancel;
    // 设置cancelToken对象
    config.cancelToken = new axios.CancelToken(function (c) {
      cancel = c;
    });
    // 阻止重复请求。当上个请求未完成时，相同的请求不会进行
    stopRepeatRequest(reqList, config.url, cancel, `${config.url} 请求被中断`);

    // removereqQueue(config); // 检查是否重复发送请求
    // addreqQueue(config); //将本次请求加入请求队列

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default'];
    // 二进制数据则直接返回
    if (
      res.request.responseType === 'blob' ||
      res.request.responseType === 'arraybuffer'
    ) {
      return res.data; //返回调用接口后获取的数据里data里数据
      // return res //返回调用接口后获取的数据
    }
    if (code === 200) {
      Message({
        message: msg,
        type: 'success',
      });
    }
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        MessageBox.confirm(
          '登录状态已过期，您可以继续留在该页面，或者重新登录',
          '系统提示',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            isRelogin.show = false;
            store.dispatch('LoginOut').then(() => {
              location.href = '/#/login';
            });
          })
          .catch(() => {
            isRelogin.show = false;
          });
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。');
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error',
      });
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      Notification.error({
        title: msg,
      });
      return Promise.reject('error');
    } else {
      // return res.data  //返回调用接口后获取的数据里data里数据
      return res; //返回调用接口后获取的数据
    }
  },
  (error) => {
    console.log('err' + error);
    let { message } = error;
    if (message == 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常';
    }
    Message({
      message: message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交

service.interceptors.response.use(
  (res) => {
    // 增加延迟，相同请求不得在短时间内重复发送

    setTimeout(() => {
      allowRequest(reqList, res.config.url);
    }, interval);
    // ...请求成功后的后续操作
    // successHandler(response)
    return res;
  },
  (error) => {
    if (axios.isCancel(thrown)) {
      console.log(thrown.message);
    } else {
      // 增加延迟，相同请求不得在短时间内重复发送
      setTimeout(() => {
        allowRequest(reqList, error.config.url);
      }, interval);
    }
  }
);

// service.interceptors.response.use(
//   (res) => {
//     setTimeout(function () {
//       removereqQueue(res.config); //请求从请求队列移除
//     }, interval)
//     return res
//   },
//   (error) => {
//     setTimeout(function () {
//       removereqQueue(error.config); //请求从请求队列移除
//     }, interval)
//   }
// )

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({
    text: '正在下载数据，请稍候',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  return service
    .post(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params);
        },
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      timeout: 3 * 60 * 1000,
    })
    .then(async (data) => {
      const isLogin = await blobValidate(data);
      if (isLogin) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg =
          errorCode[rspObj.code] || rspObj.msg || errorCode['default'];
        Message.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch((r) => {
      console.error(r);
      Message.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}

export default service;
