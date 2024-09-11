<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
*,
body,html {
  margin: 0;
  padding: 0;
}

#app {
    width: 100%;
  margin: 0;
  padding: 0;
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // height: 100%;
}

nav {
  // padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
