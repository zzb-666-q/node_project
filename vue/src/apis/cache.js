const qs = require("qs");
const axios = require("axios");

const reqQueue = new Map();
function regsoleKey(config) {
  const { method, url, params, data } = config;
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&')
}
//添加请求
export function addreqQueue(config) {
  //调用生成唯一标识值函数, 生成 requestKey
  const requestKey = regsoleKey(config);

  //为每个请求创建一个专属的 CancelToken(用于取消请求)
  config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
    // 判断 reqQueue 中是否含有 requestKey, 
    // 将 requestKey 与 CancelToken 以键值对的形式保存到map对象中
    if (!reqQueue.has(requestKey)) {
      console.log('addreqQueue21323214141==>reqQueue', reqQueue)
      reqQueue.set(requestKey, cancel);
    }
  });
}
//取消之前发出请求
export function removereqQueue(config) {
  // 标识值
  const requestKey = regsoleKey(config);

  if (reqQueue.has(requestKey)) {
    console.log('removereqQueue==>reqQueue', reqQueue)
    // 取消之前发出请求
    const cancelToken = reqQueue.get(requestKey);
    cancelToken(requestKey);
    // 从队列移除
    reqQueue.delete(requestKey);
    // setTimeout(function () {
    //   // 从队列移除
    //   reqQueue.delete(requestKey);
    // }, 1000)
  }
}




// 正在进行中的请求列表
let reqList = []

/**
 * 阻止重复请求
 * @param {array} reqList - 请求缓存列表
 * @param {string} url - 当前请求地址
 * @param {function} cancel - 请求中断函数
 * @param {string} errorMessage - 请求中断时需要显示的错误信息
 */
export function stopRepeatRequest(reqList, url, cancel, errorMessage) {
  const errorMsg = errorMessage || ''
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      cancel(errorMsg)
      return
    }
  }
  reqList.push(url);
  console.log('reqList', reqList)
}

/**
 * 允许某个请求可以继续进行
 * @param {array} reqList 全部请求列表
 * @param {string} url 请求地址
 */
export function allowRequest(reqList, url) {
  for (let i = 0; i < reqList.length; i++) {
    if (reqList[i] === url) {
      reqList.splice(i, 1)
      break
    }
  }
}

