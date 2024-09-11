<template>
  <div class="new-type">
    <div>
      <el-button size="small" @click="back">返回</el-button>
    </div>
    <div class="form-box">
      <el-form
        ref="typeData"
        :model="typeData"
        label-width="70px"
        :rules="rules"
      >
        <el-form-item label="商品类型" prop="name">
          <el-input v-model="typeData.name"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="commit('typeData')">{{
            typeId ? "立即保存" : "立即创建"
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewType",
  data() {
    var validateName = (rule, value, callback) => {
      let nameReg = /^[A-Za-z\u4e00-\u9fa5]{1,16}$/;

      if (value === "") {
        callback(new Error("请输入商品类型"));
      } else if (!nameReg.test(value)) {
        callback(new Error("商品类型支持中英文组合(1-16位)"));
      } else {
        callback();
      }
    };

    return {
      rules: {
        name: [{ validator: validateName, trigger: "blur" }],
      },

      typeData: {
        name: "",
      },

      typeId: "",

      copyName: "",
    };
  },

  created() {
    this.typeId = this.$route.params.typeId;

    if (this.typeId) {
      this.getTypeByTypeId();
    }
    console.log("this.typeId ==> ", this.typeId);
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    //创建商品类型
    createType(formName) {
      console.log("this.typeData==>", this.typeData);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("表单验证通过");
          this.axios({
            method: "post",
            url: "/createType",
            data: {
              ...this.typeData,
            },
          })
            .then((result) => {
              if (result.data.code === 200) {
                this.$router.go(-1);
              }
            })
            .catch((err) => {
              console.log("err ==> ", err);
            });
        }
      });
    },

    //根据商品类型typeId查询商品类型数据
    getTypeByTypeId() {
      this.axios({
        method: "get",
        url: "/typeByTypeId",

        params: {
          typeId: this.typeId,
        },
      })
        .then((result) => {
          if (result.data.code === 1080) {
            this.typeData.name = result.data.result[0].name;
            this.copyName = result.data.result[0].name;
          }
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    //编辑商品类型
    editType(formName) {
      if (this.copyName === this.typeData.name) {
        console.log("和原来的商品类型一致");
        return;
      }

      this.$refs[formName].validate((valid) => {
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
              if (result.data.code === 1090 && result.data.result[0] === 1) {
                this.$router.go(-1);
              }
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
  },
};
</script>

<style lang="less" scoped>
.form-box {
  width: 400px;
  margin-top: 30px;
}
</style>