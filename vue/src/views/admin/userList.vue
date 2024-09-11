<template>
  <div class="userList">
    <div>
      <el-form
        ref="searchData"
        :inline="true"
        :model="searchData"
        class="demo-form-inline"
      >
        <el-form-item label="用户名称" prop="name">
          <el-input
            v-model="searchData.name"
            placeholder="用户名称"
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
          
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="resetQuery('searchData')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="createUser">创建用户</el-button>
        <el-button type="danger" :disabled="userIds.length === 0"
          >删除</el-button
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

        <el-table-column label="用户昵称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.nickName ? scope.row.nickName : "无" }}</span>
          </template>
        </el-table-column>

        <el-table-column label="用户邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone ? scope.row.phone : "无" }}</span>
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

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="searchData.offset"
        :limit.sync="searchData.limit"
        @pagination="getUserlist"
      />
    </div>
    <el-dialog
      title="提示"
      :visible.sync="open"
      width="40%"
      :modal="false"
      @closed="closeDialog"
      center
    >
      <register @register="registerSuccess"></register>
    </el-dialog>
  </div>
</template>

<script>
import { tool } from "@/tool/tool.js";
import { getUserlist, sendValidCode } from "@/apis/user";
import register from "@/views/register.vue";

export default {
  name: "userList",
  components: { register },
  data() {
    return {
      searchData: {
        name: "",
        createdAt: "",
        offset: 1,
        limit: 5,
      },
      tableData: [],
      total: 0,
      open: false,
      //选择商品id
      userIds: [],
      //删除当前商品
      userId: "",
      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
        email: "",
        validCode: "",
      },
      isSend: false,
      text: "发送验证码",
      //表单校验
      rules: {
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: "请输入正确的邮箱地址",
            trigger: "blur",
          },
        ],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
        ],
        age: [{ required: true, message: "年龄不能为空", trigger: "blur" }],
        validCode: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.search();
  },

  methods: {
    // goPage(name) {
    //   this.$router.push({ name });
    // },
    //获取用户列表
    getUserlist() {
      getUserlist(this.searchData).then((res) => {
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
      this.getUserlist();
    },
    //注册成功
    registerSuccess() {
      this.open = false;
    },
    closeDialog() {
      this.open = false;
    },
    //选择用户
    selectionData(value) {
      //
      let userIds = [];
      value.forEach((item) => {
        userIds.push(item.userId);
      });
      this.userIds = userIds;
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
.userList {
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
