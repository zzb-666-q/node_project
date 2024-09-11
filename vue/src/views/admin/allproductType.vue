<template>
    <div class="type-list">
      <div>
        <el-form ref="searchData" :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="创建人" prop="nickName">
            <el-input
              v-model="searchData.nickName"
              placeholder="创建人"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品类型" prop="typeName">
            <el-input
              v-model="searchData.typeName"
              placeholder="商品类型"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="创建日期" prop="createdAt">
            <el-date-picker
              v-model="searchData.createdAt"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="resetQuery('searchData')">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
        
      </div>
      <div class="list-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          @selection-change="selectionData"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
  
          <el-table-column label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
  
          <!-- <el-table-column label="用户昵称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.nickName ? scope.row.nickName : '无' }}</span>
            </template>
          </el-table-column> -->
  
          <el-table-column label="创建邮箱" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品类型" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.typeName ? scope.row.typeName : '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.nickName ? scope.row.nickName : '无' }}</span>
            </template>
          </el-table-column>
  
          <el-table-column label="创建日期" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createdAt }}</span>
            </template>
          </el-table-column>
  
          <!-- <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button size="mini" @click="editProduct(scope.row.product_id)"
                >编辑</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
        <!-- <div class="page-box">
          <el-pagination background layout="prev, pager, next, total" :page-size="limit" :pager-count="pagerCount"
            :current-page="currentPage" :total="total" @current-change="currentChange">
          </el-pagination>
        </div> -->
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="searchData.offset"
          :limit.sync="searchData.limit"
          @pagination="getAlluserTypeList"
        />
      </div>
      
    </div>
  </template>
    
  <script>
  import { tool } from "@/tool/tool.js";
  import { getAlluserTypeList } from "@/apis/product";
  
  
  
  export default {
    name: "userList",
    data() {
      return {
        searchData: {
          nickName: "",
          createdAt: "",
          offset: 1,
          limit: 5,
        },
        tableData: [],
        total: 0,
        open: false,
        typeData: [],
        //选择商品id
        productIds: [],
        //删除当前商品
        productId: "",
      
       
      };
    },
  
    created() {
      this.search();
    },
  
    methods: {
      goPage(name) {
        this.$router.push({ name });
      },
      //获取用户列表
      getAlluserTypeList() {
        getAlluserTypeList(this.searchData).then((res) => {
          this.tableData = res.data.result;
          this.total = res.data.count;
        });
      },
      createUser() {
        this.open = true;
      },
      
      //搜索
      search() {
        this.searchData.offset = 1;
        this.getAlluserTypeList();
      },
  
      //换页
      currentChange(pageCode) {
        //设置偏移量
        this.searchData.offset = (pageCode - 1) * this.limit;
        this.getAlluserTypeList();
      },
  
      //选择商品
      selectionData(value) {
        //
        let productIds = [];
        value.forEach((item) => {
          productIds.push(item.product_id);
        });
        this.productIds = productIds;
      },
  
      closeDialog() {
        this.productId = "";
      },
  
      //编辑商品
      editProduct(productId) {
        // this.$router.push({ name: "NewProduct", params: { productId } });
      },
      /** 重置按钮操作 */
    resetQuery(formName) {
      this.resetForm(formName);
      this.search();
    },
    },
  };
  </script>
    
  <style lang="less" scoped>
  .type-list {
    .el-form-item {
      margin-bottom: 15px;
    }
  
    .list-box {
      text-align: center;
      margin-top: 30px;
    }
  
    .page-box {
      text-align: center;
      margin-top: 15px;
    }
  
    .dialog-title {
      text-align: center;
    }
  
    .product-img {
      width: 80px;
      height: 60px;
      margin: 0 auto;
  
      .auto-img {
        width: 80px;
        height: 60px;
      }
    }
  }
  
  .validcode-box {
    display: flex;
  
    .validcode-ipt {
      margin-right: 50px;
    }
  }
  </style>