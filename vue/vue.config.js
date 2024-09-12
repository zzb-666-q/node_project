const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: 'localhost',
    port: 8080, //设置默认启动端口号
    open: true, //自动打开浏览器
    proxy: {
      '/apis': {
        // target: 'http://127.0.0.1:9000',  // 接口域名
        target: process.env.VUE_APP_BASE_API, // 接口域名
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true,
        ws: true, //是否跨域
        pathRewrite: {
          '^/apis': '', //需要rewrite的,
        },
      },
    },
  },
});
