<template>
  <div class="type-list">
    <div>
      <el-form
        ref="searchData"
        :inline="true"
        :model="searchData"
        class="demo-form-inline"
      >
        <el-form-item label="类型名称" prop="name">
          <el-input
            v-model="searchData.name"
            placeholder="类型名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="创建日期" prop="createdAt">
          <!-- <el-date-picker v-model="searchData.createdAt" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker> -->
          <el-date-picker
            v-model="searchData.createdAt"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
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
        <el-button type="primary" @click="openTypes">创建商品类型</el-button>
        <el-button
          type="danger"
          :disabled="typeIds.length === 0"
          @click="confirmRemoveType"
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

        <el-table-column label="商品类型" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建日期" width="300">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button size="mini" @click="editType(scope.row.typeId)">编辑</el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="removeType(scope.row.typeId)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="searchData.offset"
          :limit.sync="searchData.limit"
          @pagination="getList"
        />
      </div>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      :modal="false"
      @closed="closeDialog"
      center
    >
      <div class="dialog-title">是否确认删除商品类型？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRemoveType">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="创建商品类型"
      :visible.sync="openType"
      width="30%"
      :modal="false"
      @closed="closeDialog"
      center
    >
      <el-form
        ref="typeData"
        :model="typeData"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="商品类型" prop="name">
          <el-input v-model="typeData.name"></el-input>
        </el-form-item>

        <!-- <el-form-item>
          <el-button type="primary" @click="commit('typeData')">{{
            typeId ? "立即保存" : "立即创建"
          }}</el-button>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openType = false">取 消</el-button>
        <el-button type="primary" @click="commit('typeData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userTypeList, createType } from "@/apis/product";
export default {
  name: "TypeList",
  data() {
    return {
      searchData: {
        name: "",
        createdAt: "",
        offset: 1,
        limit: 5,
      },
      tableData: [],
      //选择商品类型的typeId
      typeIds: [],
      typeId: "",
      total: 0,
      centerDialogVisible: false,
      openType: false,
      typeData: {
        name: "",
        typeId: "",
      },
      rules: {
        name: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
      },
    };
  },

  created() {
    this.getList();
    // this.getAllTypeCount();
  },

  methods: {
    openTypes() {
      this.openType = true;
    },
    /** 重置按钮操作 */
    resetQuery(formName) {
      this.resetForm(formName);
      this.search();
    },

    goPage(name) {
      this.$router.push({ name });
    },
    //创建商品类型
    createType(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("表单验证通过");
          createType(this.typeData).then((res) => {
            this.openType = false;
            this.search();
            this.typeData = {};
          });
        }
      });
    },
    //编辑商品类型
    editType() {
      if (this.copyName === this.typeData.name) {
        console.log("和原来的商品类型一致");
        return;
      }

      this.$refs["typeData"].validate((valid) => {
        if (valid) {
          console.log("表单验证通过");
          this.axios({
            method: "post",
            url: "/editType",

            data: {
              ...this.typeData,
              typeId: this.typeId,
            },
          })
            .then((result) => {
              console.log("编辑商品类型 result ==> ", result);
              this.openType = false;
              this.search();
            })
            .catch((err) => {
              console.log("err ==> ", err);
            });
        }
      });
    },
    commit(formName) {
      if (this.typeId) {
        //编辑保存
        this.editType(formName);
      } else {
        //创建保存
        this.createType(formName);
      }
    },

    getList() {
      userTypeList(this.searchData).then((res) => {
        this.tableData = res.data.result;
        this.total = res.data.count;
      });
    },

    //搜索
    search() {
      this.searchData.offset = 1;
      this.getList();
    },

    //选择表格数据
    selectionData(value) {
      //
      let typeIds = [];
      value.forEach((v) => {
        typeIds.push(v.typeId);
      });

      this.typeIds = typeIds;
    },

    //删除商品类型
    removeType(typeId) {
      this.centerDialogVisible = true;
      this.typeId = typeId;
    },

    //确认删除商品类型
    confirmRemoveType() {
      // return;
      let typeIds = [];

      //单个删除
      if (this.typeId) {
        typeIds = [this.typeId];
      } else {
        //多个删除
        typeIds = [...this.typeIds];
      }

      this.axios({
        method: "post",
        url: "/removeType",
        data: {
          typeIds,
        },
      })
        .then((result) => {
          if (result.data.code === 200) {
            //重置页面数据
            this.search();

            // this.typeId = '';
          }
          this.centerDialogVisible = false;
        })
        .catch((err) => {});
    },

    //关闭对话框
    closeDialog() {
      this.typeId = "";
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
    margin-top: 30px;
  }

  .page-box {
    text-align: center;
    margin-top: 15px;
  }

  .dialog-title {
    text-align: center;
  }
}
</style>
