import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// require('dotenv').config();

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { Notification, MessageBox, Message, Loading } from 'element-ui'

import axios from "axios";
import VueAxios from "vue-axios";
import VueCookies from "vue-cookies";

import { tokenUrl } from "./tokenUrl/tokenUrl.js";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree, completionImg } from "@/utils/slms";
// const process =require("dotenv").config({ path: '.env' });

// 全局方法挂载
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.selectDictLabels = selectDictLabels;
Vue.prototype.handleTree = handleTree;
Vue.prototype.completionImg = completionImg;

Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(VueCookies);

// 分页组件
import Pagination from "@/components/Pagination";
// 图片上传组件
import ImageUploader from "@/components/ImageUploader";
import imgUpload from "@/components/imgUpload";

// 全局组件挂载
Vue.component('Pagination', Pagination);
Vue.component('ImageUploader', ImageUploader);
Vue.component('imgUpload', imgUpload);

axios.defaults.baseURL = '/apis';

// // 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // console.log('config ==> ', config);

    if (tokenUrl.indexOf(config.url) > -1) {
      //获取cookie
      let token = Vue.$cookies.get("token");
      //将token挂在到请求头中
      config.headers.token = token;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    let data = {
      data: response.data,
      status: response.status,
    };
    // 未设置状态码则默认成功状态
    const code = response.data.code || 200;
    // 获取错误信息
    const msg = response.data.msg;
    if (code === 200) {
      Message({
        message: msg,
        type: 'success'
      })
    } else if (code === 500) {
      Message({
        message: msg,
        type: 'error'
      })
    } else if (code === 300) {
      Message({
        message: msg,
        type: 'warning'
      })
    }
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
