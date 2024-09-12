import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// require('dotenv').config();

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueCookies from 'vue-cookies';

import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  completionImg,
} from '@/utils/slms';
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
import Pagination from '@/components/Pagination';
// 图片上传组件
import ImageUploader from '@/components/ImageUploader';
import imgUpload from '@/components/imgUpload';

// 全局组件挂载
Vue.component('Pagination', Pagination);
Vue.component('ImageUploader', ImageUploader);
Vue.component('imgUpload', imgUpload);

axios.defaults.baseURL = '/apis';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
