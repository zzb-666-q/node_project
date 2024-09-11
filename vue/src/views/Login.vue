<template>
  <div class="loginPage">
    <!-- 注册 -->

    <div class="register" v-if="isLogin == true">
      <h1><span :class="isLogin ? 'active' : ''" @click="changeIslogin(true)">注册</span> | <span
          :class="!isLogin ? 'active' : ''" @click="changeIslogin(false)">登录</span></h1>
      <register @register="registerSuccess"></register>
    </div>
    <!-- 登录 -->
    <div class="login" v-if="isLogin == false">
      <h1><span :class="isLogin ? 'active' : ''" @click="changeIslogin(true)">注册</span> | <span
          :class="!isLogin ? 'active' : ''" @click="changeIslogin(false)">登录</span></h1>
      <div class="form-box">
        <el-form :model="Login" status-icon :rules="loginRules" ref="Login" label-width="50px" class="demo-Login">
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="Login.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" @keyup.enter.native="login('Login')" v-model="Login.password"
              autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click.native.prevent="login('Login')">登录</el-button>
            <el-button @click="resetForm('Login')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
import { userLogin } from "@/apis/user";
import register from "@/views/register.vue";

export default {
  name: "login",
  components: { register },
  data() {

    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };

    var validateEmail = (rule, value, callback) => {
      let email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (value === "") {
        callback(new Error("请输入邮箱地址"));
      } else if (!email.test(value)) {
        callback(new Error("请输入正确的邮箱地址"));
      } else {
        callback();
      }
    };

    return {
      isLogin: false, //是否切换为登录
      // isLogin: true, //是否切换为注册
      imgSvg: null,

      ruleForm: {
        pass: "",
        checkPass: "",
        age: "",
        email: "",
        validCode: "",
      },
      Login: {
        email: "123@qq.com",
        password: "123",
      },
      loginRules: {
        email: [{ validator: validateEmail, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
      },
      isSend: false,
      text: "发送验证码",
      validCodeId: "",
    };
  },
  created() {

  },
  methods: {
    //登录
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            email: this.Login.email,
            password: this.Login.password,
          }

          userLogin(data).then((result) => {
            this.$cookies.set("token", result.data.token, "1d");
            this.$router.push({ name: "TypeList" });
          });

        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //登录或注册状态
    changeIslogin(bool) {
      this.isLogin = bool;
    },
    //注册成功
    registerSuccess() {
      this.isLogin = false;
    }

  },
};
</script>

<style lang="less" scoped>
.loginPage {
  width: 100%;
  height: 100vh;
  padding: 100px 0;
  background: url('../assets/login-background.jpg') no-repeat center center / cover;

  h1 {
    margin-bottom: 20px;
    cursor: pointer;

    .active {
      color: red;
    }
  }

  .register {
    width: 500px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px 0;




    .form-box {
      width: 80%;
      margin: 0 auto;

    }

    /deep/ .el-form-item__label {
      // color: #fff;
    }

    .validcode-box {
      display: flex;
      justify-content: space-between;

      //.validcode-ipt {
      // margin-right: 50px;
      //}
      .validcode-img {
        height: 40px;

      }
    }
  }

  .login {
    width: 500px;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px 0;

    h1 {
      margin-bottom: 20px;
      cursor: pointer;
    }


    .form-box {
      width: 80%;
      margin: 0 auto;

    }

    /deep/ .el-form-item__label {
      // color: #fff;
    }

    .validcode-box {
      display: flex;

      .validcode-ipt {
        margin-right: 50px;
      }
    }
  }
}
</style>