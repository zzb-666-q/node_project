<template>
  <div class="main">
    <div class="nav-box">
      <div class="left-box">
        <!-- <div class="logo">我的</div> -->
        <div class="logo-title">后台管理系统</div>
      </div>
      <div class="right-box">
        <div class="user-img">
          <img :src="completionImg(userInfo.userImg)" alt="" v-show="userInfo.userImg" />
        </div>
        <div class="user-email" @click="getUserInfo">{{ userInfo.email }}</div>
        <!-- <div class="settings" @click="goLogin">登录</div> -->
        <div class="settings" @click="LoginOut">退出登录</div>
      </div>
    </div>

    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { getuserInfo, loginOut } from "@/apis/user";

export default {
  name: "Main",
  data() {
    return {
      userInfo: {
        email: "",
        password: "",
        userImg: "",
      },
    };
  },
  created() {


    // if (!this.$store.state.username) {
    this.getUserInfo();
    // }
  },
  mounted() {

  },
  methods: {
    goLogin() {
      this.$router.push({ name: "login" });
    },
    //获取用户信息
    getUserInfo() {
      getuserInfo().then((result) => {


        this.userInfo = { ...result.data.result };
        this.$store
          .dispatch("Login", this.userInfo)
          .then(() => {
            // console.log(`output->this.$store.state`, this.$store.state);
          })
          .catch((err) => {
            console.log(`output->err`, err);
          });
      });

      // if (result.data.code === 200) {

      // } else {
      //   this.$message({
      //     type: "info",
      //     message: result.data.msg,
      //   });
      //   this.goLogin();
      // }

    },

    LoginOut() {
      this.$confirm(`确定注销并退出系统吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: `退出登录成功`,
          });
          loginOut().then((res) => {
            console.log("res", res);
            this.$cookies.remove("token", "");
            this.goLogin();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: `已取消退出登录`,
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  background-color: #474f55;

  .nav-box {
    width: 90%;
    margin: 0 auto;
    height: 70px;
    display: flex;
    align-items: center;
    padding: 0 15px;

    .right-box {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .user-img {
      width: 40px;
      height: 40px;
      background-color: #fff;

      img {
        width: 40px;
        height: 40px;
      }
    }

    .user-email {
      margin: 0 15px;
    }

    .user-email,
    .settings {
      color: #fff;
    }

    .left-box {
      display: flex;
      align-items: center;
    }

    .logo {
      height: 50px;
      width: 50px;
      background-color: #fff;
      margin-right: 15px;
    }

    .logo-title {
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>