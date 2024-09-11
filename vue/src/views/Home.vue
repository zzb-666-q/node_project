<template>
  <el-container class="elContainer">
    <el-aside :width="!isCollapse ? '201px' : '65px'" style="background-color: rgb(245, 249, 254)">
      <el-menu class="el-menu-vertical-demo" background-color="#f5f5f5" :router="true" :collapse="isCollapse"
        @select="handleSelect" :default-active="activeIndex" :unique-opened="true">
        <el-submenu v-for="(item, indexs) in submenuList" :key="indexs" :index="item.index">
          <template slot="title">
            <i :class="item.iconClass"></i>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(items, ii) in item.children" :key="ii" :index="items.itemIndex">
            <template slot="title">
              <i :class="items.itemIconClass"></i>
              <span>{{ items.itemName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px; height:40px;line-height: 40px;">
        <el-breadcrumb separator="/" style="line-height: 40px;">
          <el-breadcrumb-item>{{ breadcrumbLlist.head }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ breadcrumbLlist.con }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ breadcrumbLlist.foot }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <el-main style="background:white">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activeIndex: "/home/typeList",
      breadcrumbLlist: {
        head: "首页",
        con: "用户商品管理",
        foot: "用户商品列表",
      },
      //菜单栏列表
      submenuList: [
        {
          index: "home",
          name: "用户商品管理",
          iconClass: "el-icon-s-goods",
          children: [
            {
              itemIndex: "/home/typeList",
              itemName: "用户商品类型",
              // itemIconClass: "el-icon-s-unfold",
            },
            {
              itemIndex: "/home/ProductList",
              itemName: "用户商品列表",
              // itemIconClass: "el-icon-postcard",
            },
          ],
        },
        {
          index: "admin",
          name: "管理员管理",
          iconClass: "el-icon-user-solid",
          children: [
            {
              itemIndex: "/admin/userList",
              itemName: "用户列表",
              // itemIconClass: "el-icon-cloudy-and-sunny",
            },
            {
              itemIndex: "/admin/allproductType",
              itemName: "商品类型",
              // itemIconClass: "el-icon-s-unfold",
            },
            {
              itemIndex: "/admin/productList",
              itemName: "商品列表",
              // itemIconClass: "el-icon-postcard",
            },
          ],
        },
        {
          index: "utils",
          name: "工具类",
          iconClass: "el-icon-user-solid",
          children: [
            {
              itemIndex: "/utils/queryFile",
              itemName: "查询文件工具",
              // itemIconClass: "el-icon-cloudy-and-sunny",
            }
          ],
        },
        // {
        //   index: "allproduct",
        //   name: "所有商品管理",
        //   iconClass: "el-icon-s-goods",
        //   children: [
        //     {
        //       itemIndex: "/allproduct/allproductType",
        //       itemName: "所有商品类型",
        //       itemIconClass: "el-icon-s-unfold",
        //     },
        //     // {
        //     //   itemIndex: "/allproduct/ProductList",
        //     //   itemName: "所有商品列表",
        //     //   itemIconClass: "el-icon-postcard",
        //     // },
        //   ],
        // },
      ],
      //控制菜单栏展开收起
      isCollapse: false,
    };
  },
  created() {
    let href = window.location.hash.split("#")[1];
    this.activeIndex = href;
    this.selectsubmenu(this.activeIndex);
    //console.log(process.env.VUE_APP_BASE_API);

  },
  methods: {
    handleSelect(obj) {
      console.log(obj); // 输出当前选中菜单的名称
      this.selectsubmenu(obj);
    },
    selectsubmenu(obj) {
      this.submenuList.forEach((ele, index) => {
        ele.children.forEach((elem, i) => {
          if (elem.itemIndex == obj) {
            this.breadcrumbLlist.con = ele.name;
            this.breadcrumbLlist.foot = elem.itemName;
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #eee;
  color: #333;
  line-height: 60px;
}

.elContainer {
  height: calc(100vh - 70px);

}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>