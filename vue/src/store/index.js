import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {
      username: "",
      userImg: "",
      userId: "",
    },
    VUE_APP_BASE_API: 'http://127.0.0.1:9000',

  },
  getters: {},
  mutations: {
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_USERID: (state, userId) => {
      state.userId = userId;
    },
    SET_USERIMG: (state, userImg) => {
      state.userImg = userImg;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
  },
  actions: {
    // 登录
    Login({ commit }, userInfo) {

      // commit("SET_USERIMG", userInfo.userImg);
      commit("SET_USERINFO", userInfo);

    },
    //登录状态取消
    LoginOut({ commit }) {
      commit("SET_USERINFO", null);
    },
  },
  modules: {},
});
