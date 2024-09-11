<template>
  <div class="type-list">
    <div>
      <el-form
        ref="searchData"
        :inline="true"
        :model="searchData"
        class="demo-form-inline"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="searchData.name"
            placeholder="商品名称"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="商品类型" prop="typeId">
          <el-select
            v-model="searchData.typeId"
            placeholder="选择商品类型"
            clearable
          >
            <el-option
              :label="item.name"
              :value="item.typeId"
              v-for="(item, index) in typeData"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品状态" prop="status">
          <el-select
            v-model="searchData.status"
            placeholder="选择商品状态"
            clearable
          >
            <!-- <el-option label="选择商品状态" value="-1"></el-option> -->
            <el-option label="上架" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="searchData.createdAt"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="resetQuery('searchData')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <div>
        <el-button
          type="primary"
          :disabled="productIds.length === 0"
          @click="updateProductStatus('', 0)"
          >批量上架商品</el-button
        >
        <el-button
          type="primary"
          :disabled="productIds.length === 0"
          @click="updateProductStatus('', 1)"
          >批量下架商品</el-button
        >
        <el-button type="primary" @click="editProduct()">创建商品</el-button>
        <el-button
          type="danger"
          :disabled="productIds.length === 0"
          @click="removeConfirm()"
          >删除选择</el-button
        >
      </div>
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

        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" align="center" width="100">
          <template slot-scope="scope">
            <div class="product-img">
              <el-image
                class="auto-img"
                :src="completionImg(scope.row.smallImg)"
                alt=""
                :preview-src-list="[completionImg(scope.row.smallImg)]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品类型" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品价格" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品状态" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status === 0 ? '上架' : '下架' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建日期" align="center" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="editProduct(scope.row.productId)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="success"
              v-show="scope.row.status == 1"
              @click="updateProductStatus(scope.row, 0)"
              >上架</el-button
            >
            <el-button
              size="mini"
              type="info"
              v-show="scope.row.status == 0"
              @click="updateProductStatus(scope.row, 1)"
              >下架</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="removeConfirm(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="searchData.offset"
        :limit.sync="searchData.limit"
        @pagination="getProductList"
      />
    </div>
    <el-dialog
      title="提示"
      :visible.sync="openProduct"
      width="70%"
      :modal="false"
      @closed="closeDialog"
      center
    >
      <NewProduct
        :productIds.sync="productId"
        @success="successNewProduct"
      ></NewProduct>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="open"
      width="30%"
      :modal="false"
      @closed="closeDialog"
      center
    >
      <div class="dialog-title">是否确认删除商品？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="remove">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const axios = require('axios');
import { tool } from '@/tool/tool.js';
import {
  getProductList,
  getType,
  updateProductStatus,
  removeProduct,
} from '@/apis/product';
import NewProduct from '@/views/NewProduct.vue';

export default {
  name: 'ProductList',
  components: { NewProduct },
  data() {
    return {
      searchData: {
        name: '',
        status: '',
        createdAt: '',
        typeId: '',
        offset: 1,
        limit: 5,
      },

      tableData: [],

      total: 0,

      open: false,
      openProduct: false,

      typeData: [],

      //选择商品id
      productIds: [],

      //删除当前商品
      productId: '',
    };
  },

  created() {
    this.getProductType();
    this.getProductList();
  },

  methods: {
    //获取商品列表
    getProductList() {
      getProductList(this.searchData).then((result) => {
        this.tableData = result.data.result;
        this.total = result.data.total;
      });
    },
    /** 重置按钮操作 */
    resetQuery(formName) {
      this.resetForm(formName);
      this.search();
    },
    //获取商品类型
    getProductType() {
      getType().then((res) => {
        this.typeData = res.data.result;
      });
    },
    //创建商品成功
    successNewProduct() {
      this.openProduct = false;
    },

    //搜索
    search() {
      this.searchData.offset = 1;
      this.getProductList();
    },

    //修改商品上下架状态
    updateProductStatus(item, status) {
      let productIds = [];
      if (item) {
        //单个删除
        productIds = [item.productId];
      } else {
        //多个删除
        productIds = [...this.productIds];
      }
      let that = this;
      this.$confirm(`是否${status == 0 ? '上架' : '下架'}商品`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let data = {
            productId: productIds,
            status,
          };
          updateProductStatus(data).then((result) => {
            if (item) {
              item.status = status;
            }
            that.search();
          });

          this.$message({
            type: 'success',
            message: `${status == 0 ? '上架' : '下架'}成功!`,
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: `已取消${status == 0 ? '上架' : '下架'}`,
          });
        });
    },

    //选择商品
    selectionData(value) {
      //
      let productIds = [];
      value.forEach((item) => {
        productIds.push(item.productId);
      });
      this.productIds = productIds;
    },

    //删除确认
    removeConfirm(productList) {
      this.open = true;
      if (productList) {
        this.productId = productList.productId;
      }
    },

    //删除
    remove() {
      let productIds = [];
      if (this.productId) {
        //单个删除
        productIds = [this.productId];
      } else {
        //多个删除
        productIds = [...this.productIds];
      }
      let data = {
        productIds,
      };
      removeProduct(data).then((result) => {
        //重置分页数据
        this.search();
        this.open = false;
      });
    },

    closeDialog() {
      this.productId = '';
    },

    //编辑或创建商品
    editProduct(productId) {
      if (productId) {
        this.productId = productId;
      }
      this.openProduct = true;
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
    width: 100%;
  }
}
</style>
