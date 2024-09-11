import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/userInfo/Login.vue'),
  },
  // 默认路由
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
    children: [
      {
        path: 'home',
        name: 'Home',
        alias: '',
        component: () => import('@/views/Home.vue'),
        children: [
          {
            path: 'typeList',
            name: 'TypeList',
            alias: '',
            component: () => import('@/views/TypeList.vue'),
          },
          {
            path: 'newType/:typeId?',
            name: 'NewType',
            component: () => import('@/views/NewType.vue'),
          },
          {
            path: 'newProduct',
            name: 'NewProduct',
            component: () => import('@/views/NewProduct.vue'),
          },
          {
            path: 'ProductList',
            name: 'ProductList',
            component: () => import('@/views/ProductList.vue'),
          },
        ],
      },
      {
        path: 'admin',
        name: 'admin',
        alias: '',
        component: () => import('@/views/Home.vue'),
        children: [
          {
            path: 'userList',
            name: 'userList',
            alias: '',
            component: () => import('@/views/admin/userList.vue'),
          },
          {
            path: 'allproductType',
            name: 'allproductType',
            alias: '',
            component: () => import('@/views/admin/allproductType.vue'),
          },
          {
            path: 'productList',
            name: 'productList',
            alias: '',
            component: () => import('@/views/admin/productList.vue'),
          },
        ],
      },
      {
        path: 'utils',
        name: 'utils',
        alias: '',
        component: () => import('@/views/Home.vue'),
        children: [
          {
            path: 'queryFile',
            name: 'queryFile',
            alias: '',
            component: () => import('@/views/utils/queryFile.vue'),
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes,
});

export default router;
